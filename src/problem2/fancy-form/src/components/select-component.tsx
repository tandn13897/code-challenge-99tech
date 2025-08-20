import {
  components,
  type GroupBase,
  type OptionProps,
  type SingleValueProps,
  type StylesConfig,
} from "react-select";
import Select from "react-select";
import type { Props as SelectProps } from "react-select";
import type { TSelectOption } from "../type/currency-type";

type CurrencySelectProps = SelectProps<
  TSelectOption,
  false,
  GroupBase<TSelectOption>
>;

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
    axHeight: "200px",
    overflowY: "auto",
    scrollbarWidth: "none",
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
          alt={data.label}
          className="selected-option"
          height={20}
          width={20}
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
      <img
        src={data.icon}
        alt={data.label}
        className="option-img"
        height={20}
        width={20}
      />
      <span className="text-white text-sm">{data.label}</span>
    </div>
  );
};

const CurrencySelect: React.FC<CurrencySelectProps> = (props) => {
  return (
    <Select
      components={{
        SingleValue: customSingleValue,
        Option: customOption,
      }}
      styles={customStyles}
      isSearchable={false}
      {...props}
    />
  );
};

export default CurrencySelect;
