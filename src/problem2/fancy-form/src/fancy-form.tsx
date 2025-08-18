import React, { useEffect, useState } from "react";
import Select, { type GroupBase, type StylesConfig } from "react-select";
import RotateIcon from "./assets/rotate-icon.svg";
import type { TCurrency, TSelectOption } from "./type/currency-type";
import { latestByCurrency } from "./helper/helper";
import "./fancy-form.css";
import {
  components,
  type SingleValueProps,
  type OptionProps,
} from "react-select";

const defaultCurrency: TCurrency = {
  currency: "",
  price: "",
  date: "",
  icon: "",
};

const customStyles: StylesConfig<
  TSelectOption,
  false,
  GroupBase<TSelectOption>
> = {
  control: () => ({
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    minHeight: "unset",
    height: "32px",
    width: "100%",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "white",
    padding: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1A1D3B",
    color: "white",
    paddingTop: "4px",
    paddingBottom: "4px",
    minWidth: "200px",
    width: "auto",
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  singleValue: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
    margin: 0,
    padding: 0,
  }),
  valueContainer: (base) => ({
    ...base,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: 0,
  }),
};

const customSingleValue = (props: SingleValueProps<TSelectOption>) => {
  const { data } = props;

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <img
          src={data.icon}
          className="selected-option w-5 h-5"
        />
        <span>{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const customOption = (props: OptionProps<TSelectOption>) => {
  const { data, innerRef, innerProps, isFocused } = props;

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={`option-container flex items-center gap-2 px-3 py-2 cursor-pointer rounded ${
        isFocused ? "bg-[#2B2F51]" : "bg-[#1A1D3B]"
      } last:mb-0`}
    >
      <img src={data.icon} className="w-5 h-5 option-img" />
      <span className="text-white text-sm">{data.label}</span>
    </div>
  );
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
            <Select
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
              components={{
                SingleValue: customSingleValue,
                Option: customOption,
              }}
              styles={customStyles}
              isSearchable={false}
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
            <Select
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
              components={{
                SingleValue: customSingleValue,
                Option: customOption,
              }}
              styles={customStyles}
              isSearchable={false}
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
