import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { green } from "@mui/material/colors";
import Icon from "@mui/material/Icon";
import { useSelector } from "react-redux"
import { AppState } from "@/state/index"
import { Transition } from 'react-transition-group';
import { useForkRef } from "@mui/material";

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0,
  fontSize: "12px",
  verticalAlign: "middle",
  color: green[500]
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0.5 },
  exited:  { opacity: 0.5 },
};

const FadeIcon = React.forwardRef(function Fade({ in: inProp }: { in: boolean }, ref) {
  const nodeRef = React.useRef(null);
  const foreignRef = useForkRef(null, ref);
  const handleRef = useForkRef(nodeRef, foreignRef);

  return <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
    {state => (
      <div ref={handleRef} style={{ display: "inline-block" }}>
        <Icon style={{
          ...defaultStyle,
          ...transitionStyles[state]
        }}>
          circle
        </Icon>
      </div>
    )}
  </Transition>
});

export function Polling() {
  const [isMounting, setIsMounting] = useState(false)

  const currentBlock = useSelector((state: AppState) => {
    return state.app.blockNumber;
  });

  useEffect(
    () => {
      if (!currentBlock) {
        return
      }

      setIsMounting(true)
      const mountingTimer = setTimeout(() => setIsMounting(false), 1000)

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        clearTimeout(mountingTimer)
      }
    },
    [currentBlock] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  );

  return (
    currentBlock ? (<Box sx={{ margin: "10px", position: "fixed", bottom: "0", right: "0" }}>
      <div style={{ display: "inline-block", marginRight: "4px", fontSize: "12px" }}>
        <span>{currentBlock}</span>
      </div>
      <FadeIcon in={!isMounting}/>
    </Box>) : null
  );
}
