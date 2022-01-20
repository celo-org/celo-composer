import { useState, useEffect } from "react";
import { loadAppContracts } from "../utils/loadAppContracts";

export const useContractConfig = () => {
  const [contractsConfig, setContractsConfig] = useState({});

  useEffect(() => {
    const loadFunc = async () => {
      const result = await loadAppContracts();
      setContractsConfig(result);
    };
    void loadFunc();
  }, []);
  return contractsConfig;
};