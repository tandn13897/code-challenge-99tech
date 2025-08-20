import React, { useEffect, useState } from "react";
import RotateIcon from "./assets/rotate-icon.svg";
import type { TCurrency, TSelectOption } from "./type/currency-type";
import { latestByCurrency } from "./helper/helper";
import "./fancy-form.css";
import CurrencySelect from "./components/select-component";

const defaultCurrency: TCurrency = {
  currency: "",
  price: "",
  date: "",
  icon: "",
};

const Swap: React.FC = () => {
  const [currencyList, setCurrencyList] = useState<TCurrency[]>([]);
  const [fromCurrency, setFromCurrency] = useState<TCurrency>(defaultCurrency);
  const [toCurrency, setToCurrency] = useState<TCurrency>(defaultCurrency);
  const [error, setError] = useState<string | null>(null);
  const [fromAmount, setFromAmount] = useState(0);
  const [toAmount, setToAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data = await res.json();
        const currenciesWithIcon = latestByCurrency(data);

        setCurrencyList(currenciesWithIcon);
        setFromCurrency(currenciesWithIcon[0]);
        setToCurrency(currenciesWithIcon[1]);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);

    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const tokenOptions: TSelectOption[] = currencyList.map((token) => ({
    value: token.currency,
    label: token.currency,
    icon: token.icon,
  }));

  const validateInputs = (): boolean => {
    if (!fromCurrency || !fromCurrency.currency) {
      setError("Please select a token to swap from.");
      return false;
    }

    if (!toCurrency || !toCurrency.currency) {
      setError("Please select a token to swap to.");
      return false;
    }

    if (fromCurrency.currency === toCurrency.currency) {
      setError("Cannot swap the same token.");
      return false;
    }

    if (isNaN(fromAmount) || fromAmount <= 0) {
      setError("Enter a valid amount greater than 0.");
      return false;
    }

    if (!toCurrency.price || !toCurrency.price) {
      setError("Price data not available.");
      return false;
    }

    setError("");
    return true;
  };

  const handleConvertCurrency = () => {
    if (!validateInputs()) return;
    const fromPrice = Number(fromCurrency.price);
    const toPrice = Number(toCurrency.price);
    const fromAmountValue = Number(fromAmount);

    const result = (fromAmountValue * fromPrice) / toPrice;
    setToAmount(result);
  };

  return (
    <div className="swap-container mx-auto mt-10 shadow-lg">
      <div className="swap-section">
        <div className="swap-label">
          <span>Swap</span>
          <span className="balance">Available</span>
        </div>
        <div className="input-container">
          <div className="w-[140px]">
            <CurrencySelect
              value={{
                value: fromCurrency.currency,
                label: fromCurrency.currency,
                icon: fromCurrency.icon,
              }}
              options={tokenOptions}
              onChange={(option) => {
                const token = currencyList.find(
                  (t) => t.currency === option?.value
                );
                if (token) setFromCurrency(token);
              }}
            />
          </div>

          <input
            type="number"
            className="amount-input"
            placeholder="0"
            value={fromAmount}
            onChange={(e) => setFromAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="swap-arrow-container">
        <button className="swap-arrow" onClick={handleSwap}>
          <img src={RotateIcon} alt="Swap" width={20} height={20} />
        </button>
      </div>

      <div className="swap-section">
        <div className="swap-label">
          <span>For</span>
          <span className="balance">Available</span>
        </div>
        <div className="input-container">
          <div className="w-[140px]">
            <CurrencySelect
              value={{
                value: toCurrency.currency,
                label: toCurrency.currency,
                icon: toCurrency.icon,
              }}
              options={tokenOptions}
              onChange={(option) => {
                const token = currencyList.find(
                  (t) => t.currency === option?.value
                );
                if (token) setToCurrency(token);
              }}
            />
          </div>
          <input
            type="number"
            className="amount-input bg-transparent text-white w-full outline-none px-2 py-1"
            placeholder="0"
            value={toAmount}
            onChange={(e) => setToAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="swap-submit__ctn flex flex-col justify-center items-center">
        {error && <div className="error-message">{error}</div>}
        <button
          className="swap-submit__btn bg-[#4fcac7] text-[#1e1e8b]"
          onClick={handleConvertCurrency}
        >
          CONFIRM SWAP
        </button>
      </div>
    </div>
  );
};

export default Swap;
