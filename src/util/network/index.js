/**
 * Main job of this function is to normalize the data to our needs.
 */
export const fetchTop10Crypto = async (currency) => {
  const response = await fetch(
    `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=${currency}`
  );

  const result = await response.json();

  if (result.Response === "Error") {
    throw new Error(result.Message);
  }

  const normalized = {
    currency,
    cryptos: result.Data.map((info) => {
      return {
        image: `https://www.cryptocompare.com/${info.CoinInfo.ImageUrl}`,
        currency: `${info.CoinInfo.FullName}`,
        shortHand: `${info.CoinInfo.Name}`,
        price: info.RAW[currency].PRICE,
        marketCap: info.RAW[currency].MKTCAP,
        twentyFourHourChange: info.RAW[currency].CHANGEPCT24HOUR,
        displayPrice: info.DISPLAY[currency].PRICE,
        displayMarketCap: info.DISPLAY[currency].MKTCAP,
        displayTwentyFourHourChange: `${info.DISPLAY[currency].CHANGEPCT24HOUR} %`,
      };
    }),
  };

  return normalized;
};
