import React, { useEffect, useState } from 'react';
import RotateIcon from './assets/rotate-icon.svg'
import './fancy-form.css';
import type { TCurrency, TSelectOption } from './type/currency-type';
import { latestByCurrency } from './helper/helper';
import Select from 'react-select/base';

const defaultTokens: TCurrency = {
  currency: '',
  price: '',
  date: '',
}

const Swap: React.FC = () => {
  const [currencyList, setCurrenctyList] = useState<TCurrency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fromToken, setFromToken] = useState<TCurrency>(defaultTokens);
  const [toToken, setToToken] = useState<TCurrency>(defaultTokens);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  let options: TSelectOption[] = [];

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount('');
    setToAmount('');
  };

  const getCurrencyRatio = async () => {
    setIsLoading(true)
    try {
      const ressponse = await fetch('https://interview.switcheo.com/prices.json');
      const currencies = await ressponse.json();
      const formatData = latestByCurrency(currencies);
      options = formatData.map((currency) => ({
        value: currency.currency,
        label: currency.currency,
      }));
      setFromToken(formatData[0]);
      setToToken(formatData[1]);
      setCurrenctyList(formatData);
      console.log(formatData);
    } catch (err) {
      console.error('Error fetching currency ratio:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCurrencyRatio();
  }, [])

  return (
    <div className="swap-container">
      <div className="swap-section">
        <div className="swap-label">
          <span>Swap</span>
          <span className="balance">Available</span>
        </div>
        <div className="input-container">
          <img src={fromToken.icon} alt={fromToken.currency} className="token-icon" />
          <Select
            className="token-select"
            value={options.find((opt) => opt.value === fromToken.currency)}
            onChange={(selected) => {
              const token = currencyList.find((t) => t.currency === selected?.value);
              if (token) setFromToken(token);
            }}
            options={options}
          />
          <input
            type="number"
            className="amount-input"
            placeholder="0"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="swap-arrow-container">
        <button className="swap-arrow" onClick={handleSwap}>
          <img src={RotateIcon} alt="Swap" height={20} width={20} />
        </button>
      </div>

      <div className="swap-section">
        <div className="swap-label">
          <span>For</span>
          <span className="balance">Available</span>
        </div>
        <div className="input-container">
          <img src={toToken?.icon} alt={toToken?.currency} className="token-icon" />
          <select
            className="token-select"
            value={toToken?.currency}
            onChange={(e) =>
              setToToken(currencyList.find((t) => t.currency === e.target.value)!)
            }
          >
            {currencyList.map((token) => (
              <option key={token.currency} value={token.currency}>
                {token.currency}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="amount-input"
            placeholder="0"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Swap;
