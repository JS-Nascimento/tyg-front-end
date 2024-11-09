'use client';
import { useState } from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { AvailableCurrency } from '@/app/interfaces/BaseCurrency';


interface SettingsFormProps {
  availableCurrencies: AvailableCurrency[];
}

export default function SettingsForm({availableCurrencies}:SettingsFormProps) {
  const [darkMode, setDarkMode] = useState(false);

  const headerText = [
    { text: 'Aparência' },
    { text: 'Preferências' },
  ];

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
                checked={darkMode}
                change={(args) => setDarkMode(args.checked)}
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
                  (currency) => ({ text: `${currency.code} - ${currency.description}`, value: currency.code })
                )}
                fields={{ text: 'text', value: 'value' }}
                value="America/Sao_Paulo"
                popupHeight="200px"
                popupWidth="400px"
                placeholder="Selecione a moeda"
                floatLabelType="Auto"
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
                dataSource={[
                  { text: 'América/São Paulo (UTC-3)', value: 'America/Sao_Paulo' },
                  { text: 'América/New York (UTC-4)', value: 'America/New_York' },
                  { text: 'Europa/Londres (UTC+0)', value: 'Europe/London' },
                  { text: 'Ásia/Tokyo (UTC+9)', value: 'Asia/Tokyo' },
                ]}
                fields={{ text: 'text', value: 'value' }}
                value="America/Sao_Paulo"
                popupHeight="200px"
                popupWidth="300px"
                placeholder="Selecione o fuso horário"
                floatLabelType="Auto"
              />
            </div>

            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-1">País/Região</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Localização regional
              </p>
              <DropDownListComponent
                dataSource={[
                  { text: 'Brasil', value: 'BR' },
                  { text: 'Estados Unidos', value: 'US' },
                  { text: 'Espanha', value: 'ES' },
                  { text: 'Japão', value: 'JP' },
                ]}
                fields={{ text: 'text', value: 'value' }}
                value="BR"
                popupHeight="200px"
                popupWidth="200px"
                placeholder="Selecione o país"
                floatLabelType="Auto"
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
)
  ;

  return (
    <div className="w-full max-w-8xl mx-auto p-2">
      <div
        className="bg-white dark:bg-background-alternativedark text-zinc-900 dark:text-gray-50 shadow-sm rounded-lg">
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
    </div>
  );
}