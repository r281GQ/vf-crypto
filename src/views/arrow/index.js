import { css, jsx } from "@emotion/core";
import { FaArrowLeft } from "react-icons/fa";
import { useHistory } from "react-router-dom";

/** @jsx jsx */
const Arrow = () => {
  const { goBack } = useHistory();

  return (
    <div
      aria-label="back"
      role="button"
      tabIndex="0"
      css={css`
        display: flex;
        align-items: center;
        cursor: pointer;
      `}
      onClick={() => {
        goBack();
      }}
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          goBack();
        }
      }}
    >
      <FaArrowLeft />
    </div>
  );
};

export default Arrow;
