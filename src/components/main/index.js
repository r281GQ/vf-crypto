import { css, jsx } from "@emotion/core";

/** @jsx jsx */
const Main = (props) => {
  return (
    <main
      css={css`
        display: flex;
        align-items: center;
        flex-direction: column;
        flex: 1;
      `}
    >
      {props.children}
    </main>
  );
};

export default Main;
