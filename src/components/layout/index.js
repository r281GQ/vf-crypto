import { css, jsx } from "@emotion/core";

/** @jsx jsx */
const Layout = (props) => {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      `}
    >
      {props.children}
    </div>
  );
};

export default Layout;
