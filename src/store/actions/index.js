export const setSelectedCurrency = (currency) => {
  return {
    type: "SET_SELECTED_CURRENCY",
    payload: { currency },
  };
};
