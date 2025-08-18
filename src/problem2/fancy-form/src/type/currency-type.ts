type TCurrency = {
  currency: string;
  price: string;
  date: string | Date;
  icon?: string;
};

type TSelectOption = {
  value: string;
  label: string;
  icon?: string;
}

export type { TCurrency, TSelectOption }