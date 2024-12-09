export const formatNumberWithCurrency = (value, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(value);
  };
  