import { css, jsx } from "@emotion/core";

/**
 * From https://loading.io/css/.
 */
/** @jsx jsx */
const Spinner = (props) => {
  const { color = "black", size = 32 } = props;

  return (
    <div
      css={css`
        display: inline-block;

        :after {
          content: " ";
          display: block;
          width: ${size}px;
          height: ${size}px;
          margin: 8px;
          border-radius: 50%;
          border: 6px solid #fff;
          border-color: ${color} transparent ${color} transparent;
          animation: lds-dual-ring 1.2s linear infinite;
        }

        @keyframes lds-dual-ring {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
    />
  );
};

export default Spinner;
