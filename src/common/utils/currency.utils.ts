export enum CurrencyEnum {
  BRL = 'BRL',
  USD = 'USD',
  EUR = 'EUR',
}

export const formatNumberToCurrency = (
  currency: CurrencyEnum,
  number: number,
) => {
  return new Intl.NumberFormat(currency, {
    style: 'currency',
    currency: currency,
  }).format(number);
};
