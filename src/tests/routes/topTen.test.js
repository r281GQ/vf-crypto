import React from "react";
import { render, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Provider } from "react-redux";
import { useHistory } from "react-router-dom";

import TopTen from "./../../routes/topTen";
import store from "./../../store";

/**
 * Mock resizeObserver.
 */
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
};

/**
 * Mock react-router-dom.
 */
jest.mock("react-router-dom", () => {
  const push = jest.fn();
  return {
    useHistory: () => {
      return { push };
    },
  };
});

describe("<TopTen />", () => {
  /**
   * Sets up network level mock with two dummy coin.
   */
  const worker = setupServer(
    rest.get(
      `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`,
      (req, res, ctx) => {
        return res(
          ctx.json({
            Data: [
              {
                CoinInfo: {
                  FullName: "Bitcoin",
                  ImageUrl: "/media/19633/btc.png",
                  Internal: "BTC",
                  Name: "BTC",
                },
                DISPLAY: {
                  USD: {
                    CHANGEPCT24HOUR: "0.99",
                    IMAGEURL: "/media/19633/btc.png",
                    MKTCAP: "$ 214.03 B",
                    PRICE: "$ 11,584.8",
                  },
                },
                RAW: {
                  USD: {
                    CHANGEPCT24HOUR: 0.9870454103652369,
                    IMAGEURL: "/media/19633/btc.png",
                    MKTCAP: 214027810559.12,
                    PRICE: 11584.84,
                  },
                },
              },

              {
                CoinInfo: {
                  FullName: "Ethereum",
                  ImageUrl: "/media/19633/btc.png",
                  Internal: "ETH",
                  Name: "ETH",
                },
                DISPLAY: {
                  USD: {
                    CHANGEPCT24HOUR: "0.99",
                    IMAGEURL: "/media/19633/btc.png",
                    MKTCAP: "$ 214.03 B",
                    PRICE: "$ 11,584.8",
                  },
                },
                RAW: {
                  USD: {
                    CHANGEPCT24HOUR: 1.9870454103652369,
                    IMAGEURL: "/media/19633/btc.png",
                    MKTCAP: 214027810559.12,
                    PRICE: 11584.84,
                  },
                },
              },
            ],
          })
        );
      }
    )
  );

  beforeAll(() => {
    worker.listen();
  });

  afterAll(() => {
    worker.close();
  });

  beforeEach(() => {
    worker.resetHandlers();
  });

  test("does not crash", () => {
    render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );
  });

  test("renders bitcoin row", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    await waitFor(() => {
      const linkElement = getByText(/bitcoin/i);
      return expect(linkElement).toBeInTheDocument();
    });
  });

  test("default order is ascending by name", async () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const arrowUp = within(getAllByText("Crypto")[1]).getByTitle("asc_order");

    expect(arrowUp).toBeInTheDocument();
  });

  test("renders footer", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const footerElement = getByText(/Last updated at/i);

    expect(footerElement).toBeInTheDocument();
  });

  test("clicking on the row redirect to the proper page", async () => {
    const { getByText } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const { push } = useHistory();

    const linkElement = getByText(/bitcoin/i);

    expect(linkElement).toBeInTheDocument();

    userEvent.click(linkElement);

    expect(push).toHaveBeenCalledWith("/BTC");
  });

  test("default order is ascending by name and clicking on the currently selected table header changes the order", async () => {
    const { getAllByText, container } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const arrowUp = within(getAllByText("Crypto")[1]).getByTitle("asc_order");

    /**
     * Checks if the arrow up svg is next to crypto in the header
     *
     * i.e. by default it is sort ascending by price.
     */
    expect(arrowUp).toBeInTheDocument();

    /**
     * This is tricky. Checking the order. I want to check what actually is in the DOM. Without knowing
     * anything about react and all.
     *
     * We have three rows in this test. First row is the header then two rows for btc and eth.
     *
     * Question is the order. I check the contents of the 2nd row at index [1].
     *
     *
     */
    const firstRowBeforeClick = container.getElementsByTagName("tr")[1];

    const bitcoinRowBeforeClick = within(firstRowBeforeClick).getByText(
      "Bitcoin"
    );

    expect(bitcoinRowBeforeClick).toBeInTheDocument();

    /**
     * Clicking on the arrow should reverse the order
     */
    userEvent.click(arrowUp);

    const arrowUpAfterClick = within(getAllByText("Crypto")[1]).queryByTitle(
      "asc_order"
    );

    /**
     * No arrow up.
     */
    expect(arrowUpAfterClick).not.toBeInTheDocument();

    const arrowDownAfterClick = within(getAllByText("Crypto")[1]).getByTitle(
      "desc_order"
    );

    /**
     * Only arrow down.
     */
    expect(arrowDownAfterClick).toBeInTheDocument();

    const firstRowAfterClick = container.getElementsByTagName("tr")[1];

    const ethereumRow = within(firstRowAfterClick).getByText("Ethereum");

    expect(ethereumRow).toBeInTheDocument();
  });

  test("click on 24 hour change should the sort and set the order to ascending", async () => {
    const { getByText, container } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const twentyFourHeader = getByText("24 hour change");

    expect(twentyFourHeader).toBeInTheDocument();

    const firstRowBeforeClick = container.getElementsByTagName("tr")[1];

    const bitcoinRowBeforeClick = within(firstRowBeforeClick).getByText(
      "Bitcoin"
    );

    expect(bitcoinRowBeforeClick).toBeInTheDocument();

    /**
     * Click on the twentyFourHourChange
     */
    userEvent.click(twentyFourHeader);

    const arrowUpAfterClick = within(getByText("24 hour change")).queryByTitle(
      "asc_order"
    );

    expect(arrowUpAfterClick).toBeInTheDocument();

    const firstRowAfterClick = container.getElementsByTagName("tr")[1];

    const ethereumRow = within(firstRowAfterClick).getByText("Bitcoin");

    expect(ethereumRow).toBeInTheDocument();
  });

  test("changing currency should load the appropriate currency", async () => {
    /**
     * Sets up eur mock.
     */
    worker.use(
      rest.get(
        `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=EUR`,
        (req, res, ctx) => {
          return res(
            ctx.json({
              Data: [
                {
                  CoinInfo: {
                    FullName: "Bitcoin",
                    ImageUrl: "/media/19633/btc.png",
                    Internal: "BTC",
                    Name: "BTC",
                  },
                  DISPLAY: {
                    EUR: {
                      CHANGEPCT24HOUR: "0.99",
                      IMAGEURL: "/media/19633/btc.png",
                      MKTCAP: "€ 214.03 B",
                      PRICE: "€ 11,584.8",
                    },
                  },
                  RAW: {
                    EUR: {
                      CHANGEPCT24HOUR: 0.9870454103652369,
                      IMAGEURL: "/media/19633/btc.png",
                      MKTCAP: 214027810559.12,
                      PRICE: 11584.84,
                    },
                  },
                },
                {
                  CoinInfo: {
                    FullName: "Ethereum",
                    ImageUrl: "/media/19633/btc.png",
                    Internal: "ETH",
                    Name: "ETH",
                  },
                  DISPLAY: {
                    EUR: {
                      CHANGEPCT24HOUR: "0.99",
                      IMAGEURL: "/media/19633/btc.png",
                      MKTCAP: "€ 214.02 B",
                      PRICE: "€ 11,584.8",
                    },
                  },
                  RAW: {
                    EUR: {
                      CHANGEPCT24HOUR: 1.9870454103652369,
                      IMAGEURL: "/media/19633/btc.png",
                      MKTCAP: 214027810559.12,
                      PRICE: 11584.84,
                    },
                  },
                },
              ],
            })
          );
        }
      )
    );

    const { getByText, findByText } = render(
      <Provider store={store}>
        <TopTen />
      </Provider>
    );

    const currencySelector = getByText("USD");

    /**
     * Opens the dropdown.
     */
    userEvent.click(currencySelector);

    const eur = getByText("EUR");

    /**
     * Selects euro.
     */
    userEvent.click(eur);

    /**
     * Wait for euro line to appear on screen.
     */
    const eurValue = await findByText("€ 214.03 B");

    expect(eurValue).toBeInTheDocument();
  });
});
