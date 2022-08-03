import { Typography, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useCelo } from "@celo/react-celo";
import { Contract, providers } from "ethers";

// @dev
// Sample of config
// const configSample = [
//   {
//     name: "Contract Name",
//     abi, //Contract ABI
//     address, //Contract address to listen to events
//   },
// ];
export function ContractEventListener({ config }) {
  const [contractEvents, setContractEvents] = useState([]);
  const [allContracts, setAllContracts] = useState([]);
  const { network } = useCelo();

  function createLog(event, key) {
    if (typeof event === "object") {
      event = JSON.stringify(event);
    }

    return (
      <code
        key={key}
        style={{
          color: "orange",
          padding: "0.5em",
          overflowWrap: "break-word",
          display: "block",
          borderBottom: "1px dotted orange",
        }}
      >
        {event}
      </code>
    );
  }

  useEffect(() => {
    if (config.length) {
      config.forEach((contract) => {
        setContractEvents((currentEvents) => [
          ...currentEvents,
          `Watching Events for ${contract.name} Contract...`,
        ]);
      });
    }

    if (config.length) {
      const provider = new providers.JsonRpcProvider(network.rpcUrl);
      config.forEach(({ abi, address }, index) => {
        const contract = new Contract(address, abi, provider);
        const eventsData = abi.filter((func) => func.type === "event");

        setAllContracts([...allContracts, contract]);

        eventsData.forEach((event, index) => {
          contract.on(
            contract.filters[event.name](
              ...new Array(event.inputs.length).fill(null, 0)
            ),
            (...args) => {
              setContractEvents((currentEvents) => [args, ...currentEvents]);
            }
          );
        });
      });
    }

    return () => {
      allContracts.forEach((contract) => contract.removeAllListeners);
    };
  }, [config]);

  return (
    <>
      <Box>
        {contractEvents.map((eventObj, key) => createLog(eventObj, key))}
      </Box>
    </>
  );
}
