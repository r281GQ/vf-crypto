import React from "react";
import { css, jsx } from "@emotion/core";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";

import theme from "./../../theme";

/**
 * These two are are separated to avoid unwanted re-renders as tables can grow big and be expensive.
 */
const DispatchTableContext = React.createContext();
const StateTableContext = React.createContext();

/**
 * Takes care of the "SET_SORT" action.
 *
 * If the column header is the selected, i.e. the table is already sorted,
 * we just want to toggle the order.
 *
 * If other header is selected, select the header we clicked on (payload.name)
 * and also set the order to "asc" as default.
 */
const handleSetSort = (prevState, action) => {
  if (action.payload.name === prevState.sort) {
    return {
      ...prevState,
      order: prevState.order === "asc" ? "desc" : "asc",
    };
  } else {
    return {
      ...prevState,
      sort: action.payload.name,
      order: "asc",
    };
  }
};

/**
 * Compound component as an abstraction over the native html elements.
 *
 * It does not do much. It allows further composition through context without being coupled to
 * a certain element.
 *
 * It also supports sorting via two props and the function-as-children patter.
 *
 * This is optional, can be left out.
 *
 * Most of the elements are there to have more control over styling and other elements.
 *
 * Just the interface, later the implementation can change.
 */

/** @jsx jsx */
const Table = (props) => {
  const { children } = props;

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "SET_SORT":
          return handleSetSort(prevState, action);

        default:
          return prevState;
      }
    },
    {
      sort: "",
      order: "asc",
    }
  );

  return (
    <DispatchTableContext.Provider value={dispatch}>
      <StateTableContext.Provider value={state}>
        <table
          css={css`
            width: 100%;
            border-collapse: collapse;
          `}
        >
          {children}
        </table>
      </StateTableContext.Provider>
    </DispatchTableContext.Provider>
  );
};

Table.Head = function Head(props) {
  const { children } = props;

  return (
    <thead
      css={css`
        color: white;
        background-color: ${theme().colors.primary};
      `}
    >
      <tr>{children}</tr>
    </thead>
  );
};

Table.TextCell = function TextCell(props) {
  const { children } = props;

  return (
    <th
      css={css`
        padding: 8px;
      `}
    >
      {children}
    </th>
  );
};

Table.Body = function TableBody(props) {
  const { children } = props;
  const state = React.useContext(StateTableContext);

  if (typeof children === "function") {
    return <tbody>{children(state)}</tbody>;
  }

  return <tbody>{children}</tbody>;
};

Table.Row = function Row(props) {
  const { children, onClick } = props;

  return (
    <tr
      css={css`
        cursor: ${props.onClick ? "pointer" : "auto"};
        :hover {
          background-color: ${theme().colors.secondary};
        }
      `}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </tr>
  );
};

Table.HeaderCell = function HeaderCell(props) {
  const { children, defaultSort, name } = props;

  const dispatch = React.useContext(DispatchTableContext);
  const { order, sort } = React.useContext(StateTableContext);

  /**
   * The SVG is hidden in the DOM, to avoid flicker. Until a better solution.
   *
   * Otherwise the column size may shrink/grow.
   */
  let arrowElement = (
    <FaRegArrowAltCircleUp
      css={css`
        opacity: 0;
      `}
    />
  );

  if (sort === name && order === "asc") {
    arrowElement = <FaRegArrowAltCircleUp title="asc_order" />;
  }

  if (sort === name && order === "desc") {
    arrowElement = <FaRegArrowAltCircleDown title="desc_order" />;
  }

  React.useEffect(() => {
    if (defaultSort) {
      dispatch({ type: "SET_SORT", payload: { name } });
    }
  }, [defaultSort, dispatch, name]);

  return (
    <th
      css={css`
        padding-bottom: 16px;
        padding-top: 16px;
        height: 40px;
        cursor: pointer;
        :hover {
          text-decoration: underline;
        }
      `}
      onClick={() => {
        dispatch({ type: "SET_SORT", payload: { name } });
      }}
    >
      {children}
      <span
        css={css`
          margin-left: 12px;
        `}
      >
        {arrowElement}
      </span>
    </th>
  );
};

export default Table;
