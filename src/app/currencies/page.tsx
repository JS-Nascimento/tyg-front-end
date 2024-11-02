import CurrencyBoard from '@/app/components/CurrencyBoard';
import WorkArea from '@/app/components/WorkArea';


export default function Currency() {

  const currencyData= [
      {
        code: 'USD',
        name: 'Dólar Americano',
        quotation: '5.30',
        rate: '1.00',
        image: 'https://flagcdn.com/20x15/us.png',
      },
      {
        code: 'EUR',
        name: 'Euro',
        quotation: '6.20',
        rate: '0.85',
        image: 'https://flagcdn.com/20x15/eu.png',
      },
      {
        code: 'GBP',
        name: 'Libra Esterlina',
        quotation: '7.50',
        rate: '0.75',
        image: 'https://flagcdn.com/20x15/gb.png',
      },
      {
        code: 'JPY',
        name: 'Iene Japonês',
        quotation: '0.05',
        rate: '200.00',
        image: 'https://flagcdn.com/20x15/jp.png',
      },
      {
        code: 'CNY',
        name: 'Yuan Chinês',
        quotation: '0.80',
        rate: '1.25',
        image: 'https://flagcdn.com/20x15/cn.png',
      },
      {
        code: 'BRL',
        name: 'Real Brasileiro',
        quotation: '1.00',
        rate: '1.00',
        image: 'https://flagcdn.com/20x15/br.png',
      }

  ];

  return (

      <WorkArea title={"Moedas"}>
      <CurrencyBoard title={'BRL - Real Brasileiro'}  data={currencyData}/>
      </WorkArea>

  )
}