import React from "react";
import { css, jsx } from "@emotion/core";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";

import theme from "../../theme";

/**
 * A very limited implementation of a dropdown component.
 *
 * It lacks proper positioning. As we would shrink the page
 * or create a dropdown elsewhere (like footer), the list element would be offscreen.
 *
 * Ideal solution to that would be a positioner element. Something like Atlassian or Evergreen did with their
 * popover / dropdown implementation.
 *
 * This point the API is very limited:
 *
 * * title: the title of the button that triggers the popover
 * * list: the array of items that will be shown in the popover
 * * value: the current selected value
 * * onChange: callback invoked when clicking on item. Called with the listItem.
 *
 * Possible improvement might be to allow children-as-function pattern to invert control back to the developer
 * so we can have customized popover.
 *
 * Same with the button. It is hardcoded now. Could be a lot more flexible while still hiding implementation details.
 */
/** @jsx jsx */
const Dropdown = (props) => {
  const { padding = 8 } = props;

  const wrapper = React.useRef();
  const targetRef = React.useRef();

  const [, setX] = React.useState();
  const [, setY] = React.useState();
  const [width, setWidth] = React.useState();
  const [height, setHeight] = React.useState();
  const [isOpen, setOpen] = React.useState(false);

  /**
   * Listens to changes of the Button element.
   *
   * In this case getBoundingClient would be sufficient but this is eventually more scalable.
   *
   * (this enables a proper positioner element later on)
   */
  React.useEffect(() => {
    const node = wrapper.current;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { x, y, width, height } = entry.contentRect;

        setX(x);
        setY(y);
        setWidth(width);
        setHeight(height);
      }
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
    };
  }, []);

  /**
   * To be able to close the dropdown we attach eventlisteners to the body.
   */
  React.useEffect(() => {
    const handleBodyClick = (e) => {
      // make sure not to close the list when we click on some part of
      // it like padding area as that would be frustrating
      if (wrapper.current && wrapper.current.contains(e.target)) {
        return;
      }

      setOpen(false);
    };

    const onEsc = (e) => {
      if (e.keyCode === 27) {
        setOpen(false);
      }
    };

    document.body.addEventListener("click", handleBodyClick);
    document.body.addEventListener("keydown", onEsc);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
      document.body.removeEventListener("keydown", onEsc);
    };
  }, []);

  const targetRect =
    targetRef.current && targetRef.current.getBoundingClientRect();

  const { width: targetWidth } = targetRect || {};

  return (
    <React.Fragment>
      <div
        ref={wrapper}
        css={css`
          position: relative;
        `}
      >
        <button
          onClick={() => {
            setOpen((x) => !x);
          }}
        >
          <div
            css={css`
              display: flex;
            `}
          >
            <div
              css={css`
                margin-right: 8px;
              `}
            >
              {props.value}{" "}
            </div>
            {isOpen ? <IoMdArrowDropupCircle /> : <IoMdArrowDropdownCircle />}
          </div>
        </button>
        {isOpen && (
          <div
            role="list"
            ref={targetRef}
            css={css`
              border: 3px solid black;
              background-color: ${theme().colors.secondary};
              padding: 8px;
              position: absolute;
              top: ${height + padding}px;
              left: ${(width - targetWidth) / 2}px;
              z-index: 10;
            `}
          >
            {props.list.map((item) => {
              return (
                <div
                  css={css`
                    margin-bottom: 8px;
                    padding: 4px;
                    text-align: center;
                    cursor: pointer;
                    :hover {
                      text-decoration: underline;
                    }
                  `}
                  tabIndex="0"
                  key={item.title}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      props.onChange(item);
                      setOpen(false);
                    }
                  }}
                  onClick={() => {
                    props.onChange(item);
                    setOpen(false);
                  }}
                >
                  {item.title}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default Dropdown;
