import { css, jsx } from "@emotion/core";

import theme from "../../theme";

/** @jsx jsx */
const Footer = (props) => {
  const { children } = props;

  return (
    <footer
      css={css`
        background-color: ${theme().colors.primary};
      `}
    >
      {children}
    </footer>
  );
};

export default Footer;
