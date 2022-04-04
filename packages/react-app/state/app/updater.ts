import { useContractKit } from "@celo-tools/use-contractkit";
import { useCallback, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { updateBlockNumber } from "./reducer";

export default function Updater(): null {
  const { network, kit } = useContractKit();

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

    const subscription = kit.web3.eth.subscribe("newBlockHeaders", (err, header) => {
      if (err) return;
      blockNumberCallback(header.number);
    })

    return () => {
      subscription.unsubscribe()
    };
  }, [dispatch, network, kit, blockNumberCallback]);

  useEffect(() => {
    dispatch(updateBlockNumber({ blockNumber: state.blockNumber }));
  }, [dispatch, state.blockNumber]);

  return null;
}