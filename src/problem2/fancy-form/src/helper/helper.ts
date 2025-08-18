import type { TCurrency } from '../type/currency-type';

const latestByCurrency = (currencies: TCurrency[]): TCurrency[] => {
  const latestMap = currencies.reduce((map, item) => {
    const existing = map.get(item.currency);
    if (!existing || new Date(item.date) > new Date(existing.date)) {
      map.set(item.currency, item);
    }
    return map;
  }, new Map<string, TCurrency>());

  return Array.from(latestMap.values()).map((currency) => ({
    ...currency,
    icon: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency.currency}.svg`,
    date: currency.date ? new Date(currency.date) : '',
  }));
};


export { latestByCurrency }