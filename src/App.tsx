import React, { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosResponse } from 'axios';
import Select from 'react-select';
import { ArrowsCounterClockwise } from "phosphor-react";

type Currency = {
  value: string;
  label: string;
};

type ExchangeRates = {
  [key: string]: number;
};

function App(): JSX.Element {
  const [baseCurrency, setBaseCurrency] = useState<string>('EUR');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [amount, setAmount] = useState<number>(1);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const accessKey: string = 'efee33b5965ef65cd7229ba0521a2241';



  const currencies: Currency[] = [
    { value: 'EUR', label: 'Euro' },
    { value: 'USD', label: 'US Dollar' },
    { value: 'CZK', label: 'Czech Koruna' },
    { value: 'GBP', label: 'British Pound' },
  ];

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = (): void => {
    axios
      .get(`http://api.exchangeratesapi.io/v1/latest?access_key=${accessKey}`)
      .then((response: AxiosResponse<{ rates: ExchangeRates }>) => {
        setExchangeRates(response.data.rates);
      })
      .catch((error: Error) => {
        console.error('Error fetching data', error);
      });
  };

  const baseCurrencyOption = currencies.find(curr => curr.value === baseCurrency);
  const targetCurrencyOption = currencies.find(curr => curr.value === targetCurrency);

  const handleBaseCurrencyChange = (selectedOption: Currency | null): void => {
    if (selectedOption && 'value' in selectedOption) {
      setBaseCurrency(selectedOption.value);
    }
  };

  const handleTargetCurrencyChange = (selectedOption: Currency | null): void => {
    if (selectedOption && 'value' in selectedOption) {
      setTargetCurrency(selectedOption.value);
    }
  };

  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(event.target.value));
  };

  const convertedAmount = convertCurrency();

  function convertCurrency(): string {
    const baseRate = exchangeRates[baseCurrency];
    const targetRate = exchangeRates[targetCurrency];

    if (baseRate && targetRate) {
      const convertAmount = (amount / baseRate) * targetRate;
      return convertAmount.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + ' ' + targetCurrency;
    }
    return 'Invalid currency';
  }

  return (
    <div className="flex items-center justify-center m-[200px]">
      <div className="flex flex-col items-center justify-center text-center h-[400px] w-[600px] bg-white rounded-md">
        <h1 className="text-3xl font-bold mb-5">Currency Converter</h1>
        <div className="flex">
          <div className="currency-select px-10 text-2xl ">
            <label className="font-bold">Base Currency:</label>
            <Select<Currency>
              options={currencies}
              value={baseCurrencyOption}
              onChange={handleBaseCurrencyChange}
            />
          </div>
          <div className="currency-select px-10 text-2xl ">
            <label className="font-bold">Target Currency:</label>
            <Select<Currency>
              options={currencies}
              value={targetCurrencyOption}
              onChange={handleTargetCurrencyChange}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center text-2xl font-bold">

          <div className="relative flex items-center">
            <input
              className="py-4 pl-10 border hover:border-lime-700 flex justify-center items-center text-center pr-10"
              type="number"
              value={amount.toString()}
              onChange={handleAmountChange}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
              {baseCurrency}
            </span>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>



          <div className="mx-10">
            <ArrowsCounterClockwise size={100} color="#170707" />
          </div>



          <div className="relative flex items-center">
            <input
              className="py-4 pl-10 border hover:border-lime-700 flex justify-center items-center text-center pr-10"
              type="text"
              readOnly
              value={`${convertedAmount} `}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default App;
