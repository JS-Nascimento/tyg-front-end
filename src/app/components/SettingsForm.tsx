'use client';
import { useCallback, useEffect, useState } from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';
import { Locale, Timezone } from '@/app/interfaces/SettingsOptions';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { GrUserSettings } from 'react-icons/gr';
import { useToast } from '@/app/services/ToastService';
import { useLoading } from '@/app/components/LoadingSystem';
import { UserDataSettings } from '@/app/types/User';
import { getErrorByCode } from '@/app/errors/ErrorMessages';
import DecimalInput from '@/app/components/syncfusion/NumericInput';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/app/store/userStore';
import { useTheme } from '../themes/ThemeContext';

interface SettingsFormProps {
  availableCurrencies: AvailableCurrency[];
  availableTimezones: Timezone[];
  availableLocales: Locale[];
  actualSettings: UserDataSettings;
}

export default function SettingsForm({
                                       availableCurrencies,
                                       availableTimezones,
                                       availableLocales,
                                       actualSettings,
                                     }: SettingsFormProps) {
  console.log(actualSettings);

  const [settings, setSettings] = useState(() => ({
    baseCurrency: actualSettings.baseCurrency || '',
    decimalPlaces: actualSettings.decimalPlaces || 4,
    currencyDecimalPlaces: actualSettings.currencyDecimalPlaces || 2,
    zoneTime: actualSettings.zoneTime || '',
    locale: actualSettings.locale || '',
    darkMode: actualSettings.darkMode || false,
  }));
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { data: session, update } = useSession();
  const [ showDialog, setShowDialog ]  = useState(false);
  const { startLoading, stopLoading, isLoading } = useLoading();
  const { showToast } = useToast();
  const { updateSettings } = useUserStore();

  const headerText = [
    { text: 'Aparência' },
    { text: 'Preferências' },
  ];

  // Para o DropDownList
  interface DropDownChangeEventArgs {
    value: string;
    text: string;
    element: HTMLElement;
  }

// Para o Switch
  interface SwitchChangeEventArgs {
    checked: boolean;
    element: HTMLElement;
  }

  const handleCurrencyChange = useCallback((args: DropDownChangeEventArgs) => {
    setSettings(prev => ({ ...prev, baseCurrency: args.value }));
  }, []);

  const handleDecimalPlacesChange = useCallback((value: number) => {
    if (value !== null && value !== undefined) {
      setSettings(prev => ({ ...prev, decimalPlaces: value }));
    }
  }, []);

  const handleCurrencyDecimalPlacesChange = useCallback((value: number) => {
    if (value !== null && value !== undefined) {
      setSettings(prev => ({ ...prev, currencyDecimalPlaces: value }));
    }
  }, []);

  const handleTimezoneChange = useCallback((args: DropDownChangeEventArgs) => {
    setSettings(prev => ({ ...prev, zoneTime: args.value }));
  }, []);

  const handleLocaleChange = useCallback((args: DropDownChangeEventArgs) => {
    setSettings(prev => ({ ...prev, locale: args.value }));
  }, []);

  const handleDarkModeChange = useCallback((args: SwitchChangeEventArgs) => {
    const newDarkMode = args.checked;
    toggleDarkMode();
    setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
  }, [toggleDarkMode]);

  const handleSave = useCallback(async () => {

    if (!settings.baseCurrency) {
      showToast({
        title: 'Atenção',
        content: 'Por favor selecione uma moeda base.',
        type: 'warning',
      });
      return;
    }

    if (!settings.zoneTime) {
      showToast({
        title: 'Atenção',
        content: 'Por favor selecione um Fuso horário.',
        type: 'warning',
      });
      return;
    }

    if (!settings.locale) {
      showToast({
        title: 'Atenção',
        content: 'Por favor selecione uma configuração regional.',
        type: 'warning',
      });
      return;
    }

    startLoading();
    const data = {
      baseCurrency: settings.baseCurrency,
      zoneTime: settings.zoneTime,
      locale: settings.locale,
      decimalPlaces: settings.decimalPlaces,
      currencyDecimalPlaces: settings.currencyDecimalPlaces,
      darkMode: settings.darkMode,
    };

    try {
      const response = await fetch('/api/settings/save', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });

      const result = await response.json();

      if (!response.ok) {
        const { errorCode } = result;
        const error = getErrorByCode(errorCode);
        showToast({
          title: error.errorCode.toString() || 'Erro',
          content: error.message || 'Erro ao salvar configurações',
          type: 'error',
        });
        return;
      }

      // Atualizar a sessão com as novas configurações
      updateSettings(settings);

      showToast({
        title: 'Sucesso',
        content: 'Configurações salvas com sucesso!',
        type: 'success',
      });

    } catch (error) {
      showToast({
        title: 'Erro',
        content: 'Ocorreu um erro inesperado ao salvar configurações.',
        type: 'error',
      });
      console.error('Unexpected error:', error);
    } finally {
      stopLoading();
      console.log('Settings saved');
      setShowDialog(false);
    }

  }, [settings, startLoading, stopLoading, showToast, session, update, updateSettings]);

  const dialogButtons = [
    {
      buttonModel: {
        content: 'Cancelar',
        cssClass: 'e-flat',
      },
      click: () => setShowDialog(false),
    },
    {
      buttonModel: {
        content: 'Confirmar',
        cssClass: 'e-flat e-primary',
      },
      click: handleSave,
    },
  ];

  // useEffect(() => {
  //   setSettings(prev => ({ ...prev, darkMode: isDarkMode }));
  // }, [isDarkMode]);

  useEffect(() => {
    if (actualSettings.darkMode !== undefined) {
        if(actualSettings.darkMode !== isDarkMode) {
          toggleDarkMode();
        }
      setSettings((prev) => ({ ...prev, darkMode: actualSettings.darkMode }));
    }
  }, [actualSettings.darkMode]);


  const AppearanceTab = () => (

    <div className="px-0.5 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Coluna 1 - Tema */}
        <div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tema</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-200">Modo Escuro</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Alternar entre tema claro e escuro
                </p>
              </div>
              <SwitchComponent
                checked={settings.darkMode}
                change={(args) => handleDarkModeChange(args)}
                onLabel="On"
                offLabel="Off"
                cssClass="e-bigger"
              />
            </div>

            {/*<div className="flex justify-between items-center">*/}
            {/*  <div>*/}
            {/*    <p className="font-medium text-gray-700 dark:text-gray-200">Contraste Alto</p>*/}
            {/*    <p className="text-sm text-gray-600 dark:text-gray-400">*/}
            {/*      Melhorar contraste visual*/}
            {/*    </p>*/}
            {/*  </div>*/}
            {/*  <SwitchComponent*/}
            {/*    onLabel="On"*/}
            {/*    offLabel="Off"*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
        </div>

        {/*/!* Coluna 2 - Fonte *!/*/}
        {/*<div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">*/}
        {/*  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fonte</h3>*/}
        {/*  <div className="space-y-4">*/}
        {/*    <div>*/}
        {/*      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Tamanho da Fonte</p>*/}
        {/*      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">*/}
        {/*        Ajustar tamanho do texto*/}
        {/*      </p>*/}
        {/*      <DropDownListComponent*/}
        {/*        dataSource={fontSizes}*/}
        {/*        fields={{ text: 'text', value: 'value' }}*/}
        {/*        value="medium"*/}
        {/*        popupHeight="200px"*/}
        {/*        popupWidth="200px"*/}
        {/*        placeholder="Selecione o tamanho"*/}
        {/*        floatLabelType="Auto"*/}
        {/*      />*/}
        {/*    </div>*/}

        {/*    <div>*/}
        {/*      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Família da Fonte</p>*/}
        {/*      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">*/}
        {/*        Escolher tipo de fonte*/}
        {/*      </p>*/}
        {/*      <DropDownListComponent*/}
        {/*        dataSource={[*/}
        {/*          { text: 'Inter', value: 'inter' },*/}
        {/*          { text: 'Roboto', value: 'roboto' },*/}
        {/*          { text: 'Arial', value: 'arial' }*/}
        {/*        ]}*/}
        {/*        fields={{ text: 'text', value: 'value' }}*/}
        {/*        value="inter"*/}
        {/*        popupHeight="200px"*/}
        {/*        popupWidth="200px"*/}
        {/*        placeholder="Selecione a fonte"*/}
        {/*        floatLabelType="Auto"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}

        {/*/!* Coluna 3 - Cores *!/*/}
        {/*<div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">*/}
        {/*  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cores</h3>*/}
        {/*  <div className="space-y-4">*/}
        {/*    <div>*/}
        {/*      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Cor Primária</p>*/}
        {/*      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">*/}
        {/*        Cor principal do sistema*/}
        {/*      </p>*/}
        {/*      <DropDownListComponent*/}
        {/*        dataSource={[*/}
        {/*          { text: 'Azul', value: 'blue' },*/}
        {/*          { text: 'Verde', value: 'green' },*/}
        {/*          { text: 'Roxo', value: 'purple' }*/}
        {/*        ]}*/}
        {/*        fields={{ text: 'text', value: 'value' }}*/}
        {/*        value="blue"*/}
        {/*        popupHeight="200px"*/}
        {/*        popupWidth="200px"*/}
        {/*        placeholder="Selecione a cor"*/}
        {/*        floatLabelType="Auto"*/}
        {/*      />*/}
        {/*    </div>*/}

        {/*    <div className="flex justify-between items-center">*/}
        {/*      <div>*/}
        {/*        <p className="font-medium text-gray-700 dark:text-gray-200">Modo Daltônico</p>*/}
        {/*        <p className="text-sm text-gray-600 dark:text-gray-400">*/}
        {/*          Cores adaptadas*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*      <SwitchComponent*/}
        {/*        onLabel="On"*/}
        {/*        offLabel="Off"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );

  const PreferencesTab = () => (
    <div className="px-0.5 py-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Coluna 1 - Tema */}
        <div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Moeda</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Moeda Base</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Selecione a moeda base para conversão
              </p>
              <DropDownListComponent
                dataSource={availableCurrencies.map(
                  (currency) => ({ text: `${currency.code} - ${currency.description}`, value: currency.code }),
                )}
                fields={{ text: 'text', value: 'value' }}
                value={settings.baseCurrency}
                change={(args) => handleCurrencyChange(args)}
                popupHeight="200px"
                popupWidth="400px"
                placeholder="Selecione a moeda"
                floatLabelType="Always"
              />
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Formatação Decimal</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Selecione a quantidade de casas decimais para valores monetários
              </p>
              <DecimalInput
                value={settings.currencyDecimalPlaces}
                onChange={handleCurrencyDecimalPlacesChange}
                min={2}
                max={6}
                placeholder="Selecione a quantidade de casas decimais"
              />

            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Selecione a quantidade de casas decimais para valores percentuais e taxas
              </p>
              <DecimalInput
                value={settings.decimalPlaces}
                onChange={handleDecimalPlacesChange}
                min={1}
                max={8}
                placeholder="Selecione a quantidade de casas decimais"
              />

            </div>
            {/*<div className="flex justify-between items-center">*/}
            {/*  <div>*/}
            {/*    <p className="font-medium text-gray-700 dark:text-gray-200">Contraste Alto</p>*/}
            {/*    <p className="text-sm text-gray-600 dark:text-gray-400">*/}
            {/*      Melhorar contraste visual*/}
            {/*    </p>*/}
            {/*  </div>*/}
            {/*  <SwitchComponent*/}
            {/*    onLabel="On"*/}
            {/*    offLabel="Off"*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
        </div>

        {/*/!* Coluna 2 - Fonte *!/*/}
        <div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Fuso Horário</h3>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Região</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Selecione seu fuso horário
              </p>
              <DropDownListComponent
                dataSource={availableTimezones.map(
                  (timezone) => ({ text: `${timezone.description}`, value: timezone.zoneId }),
                )}
                fields={{ text: 'text', value: 'value' }}
                value={settings.zoneTime}
                change={(args) => handleTimezoneChange(args)}
                popupHeight="200px"
                popupWidth="300px"
                placeholder="Selecione o fuso horário"
                floatLabelType="Always"
              />
            </div>

            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">País/Região</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Localização regional
              </p>
              <DropDownListComponent
                dataSource={availableLocales.map(
                  (locale) => ({ text: `${locale.description}`, value: locale.code }),
                )}
                fields={{ text: 'text', value: 'value' }}
                value={settings.locale}
                change={(args) => handleLocaleChange(args)}
                popupHeight="200px"
                popupWidth="200px"
                placeholder="Selecione o país"
                floatLabelType="Always"
              />
            </div>
          </div>
        </div>

        {/*/!* Coluna 3 - Cores *!/*/}
        {/*<div className="bg-white dark:bg-background-alternativedark p-6 rounded-lg">*/}
        {/*  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cores</h3>*/}
        {/*  <div className="space-y-4">*/}
        {/*    <div>*/}
        {/*      <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">Cor Primária</p>*/}
        {/*      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">*/}
        {/*        Cor principal do sistema*/}
        {/*      </p>*/}
        {/*      <DropDownListComponent*/}
        {/*        dataSource={[*/}
        {/*          { text: 'Azul', value: 'blue' },*/}
        {/*          { text: 'Verde', value: 'green' },*/}
        {/*          { text: 'Roxo', value: 'purple' }*/}
        {/*        ]}*/}
        {/*        fields={{ text: 'text', value: 'value' }}*/}
        {/*        value="blue"*/}
        {/*        popupHeight="200px"*/}
        {/*        popupWidth="200px"*/}
        {/*        placeholder="Selecione a cor"*/}
        {/*        floatLabelType="Auto"*/}
        {/*      />*/}
        {/*    </div>*/}

        {/*    <div className="flex justify-between items-center">*/}
        {/*      <div>*/}
        {/*        <p className="font-medium text-gray-700 dark:text-gray-200">Modo Daltônico</p>*/}
        {/*        <p className="text-sm text-gray-600 dark:text-gray-400">*/}
        {/*          Cores adaptadas*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*      <SwitchComponent*/}
        {/*        onLabel="On"*/}
        {/*        offLabel="Off"*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-8xl mx-auto p-2">
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          disabled={isLoading}
          className={`text-white bg-blue-700 hover:bg-blue-700/90 focus:ring-4
                focus:ring-blue-700/50 focus:outline-none font-medium rounded-lg
                text-sm px-5 py-2.5 text-center inline-flex items-center
                dark:focus:ring-[#2557D6]/50
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <GrUserSettings className="h-6 w-6 font-black" />
          <span className="ml-1.5">
                {isLoading ? 'Processando...' : 'Salvar Configurações'}
              </span>
        </button>
      </div>

      <div className="bg-white dark:bg-background-alternativedark text-zinc-900 dark:text-gray-50 shadow-sm rounded-lg">
        <TabComponent
          heightAdjustMode="Auto"
          showCloseButton={false}
          animation={{
            previous: { effect: 'SlideLeftIn' },
            next: { effect: 'SlideRightIn' },
          }}
        >
          <TabItemsDirective>
            <TabItemDirective
              header={headerText[1]}
              content={PreferencesTab}
            />
            <TabItemDirective
              header={headerText[0]}
              content={AppearanceTab}
            />
          </TabItemsDirective>
        </TabComponent>
      </div>

      <DialogComponent
        width="400px"
        height="200px"
        isModal={true}
        visible={showDialog}
        buttons={dialogButtons}
        header="Salvar Alterações"
        content="Tem certeza que deseja salvar as alterações realizadas?"
        showCloseIcon={true}
        close={() => setShowDialog(false)}
      />
    </div>
  );
}