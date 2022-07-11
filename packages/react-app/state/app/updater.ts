import { useCelo } from "@celo/react-celo";
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { updateBlockNumber } from "./reducer";

export default function Updater(): null {
  const { network, kit } = useCelo();

  const dispatch = useDispatch();
  const [state, setState] = useState({ blockNumber: 0 });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((state) => {
        return { blockNumber: Math.max(blockNumber, state.blockNumber) }
      })
    },
    [setState]
  );

  useEffect(() => {
    if (!network) return undefined;

    const pollBlockNumber = async () => {
      const number = await kit.connection.getBlockNumber();
      blockNumberCallback(number);
    }

    pollBlockNumber()

    const interval = setInterval(pollBlockNumber, 10000);

    return () => clearInterval(interval);
  }, [dispatch, network, kit, blockNumberCallback]);

  useEffect(() => {
    dispatch(updateBlockNumber({ blockNumber: state.blockNumber }));
  }, [dispatch, state.blockNumber]);

  return null;
}
