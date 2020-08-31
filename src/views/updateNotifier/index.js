import React from "react";
import { css, jsx } from "@emotion/core";
import { format } from "date-fns";

import theme from "./../../theme";

/**
 * This component just displays the last time the polling was made.
 *
 * To make it more visible it flashes with a green background.
 *
 * It uses a "hack" with and keys. We use timestamp not just as the lastFetched prop
 * but also as a key. This makes it unmount/recreate on timestamp change.
 *
 * Makes the transition logic a bit more transparent. We can avoid more complex useEffect logics.
 */
/** @jsx jsx */
const UpdateNotifier = (props) => {
  const [bgColor, setBgColor] = React.useState(theme().colors.green);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setBgColor(theme().colors.primary);
    }, 2000);

    return () => {
      clearTimeout(id);
    };
  }, []);

  return props.lastFetched ? (
    <div
      css={css`
        padding: 12px;
        color: ${theme().colors.text.alt};
        background-color: ${bgColor};
        justify-content: center;
        transition: all 1s;
      `}
    >
      Last updated at: {format(props.lastFetched, "HH:mm:ss")} (
      {props.lastFetched})
    </div>
  ) : null;
};

export default UpdateNotifier;
