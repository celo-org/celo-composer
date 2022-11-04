import * as React from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import deployedContracts from "@local-contracts/deployments/hardhat_contracts.json";

// To use Truffle, Uncomment the below line and comment the hardhat_contracts.json line above
// import deployedContracts from "@local-truffle/build/contracts/Greeter.json";

import { useCelo } from "@celo/react-celo";
import { AccountInfo, Polling, ContractEventListener } from "@/components";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect } from "react";
import { ContractLayout } from "@/components/contract-components";
import Grid from "@mui/material/Grid";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function App() {
  const { network } = useCelo();
  const [value, setValue] = React.useState(0);
  const [eventConfig, setEventConfig] = React.useState([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const contracts = deployedContracts[network?.chainId?.toString()][0]?.contracts;
  // To use Truffle, Uncomment the below line and comment the  line above
  // const contracts = [deployedContracts];

  //Here we create config to watch
  //all events of contract we ever deployed
  useEffect(() => {
    if (contracts) {
      let configList = [];
      for (const contract in contracts) {
        configList.push({
          name: contract,
          abi: contracts[contract].abi,
          address: contracts[contract].address,
          // To use Truffle, Uncomment the below line and comment the above line
          // address: contracts[contract].networks[network?.chainId?.toString()].address ?? "44787",
        });
      }

      setEventConfig(configList);
    }
  }, [contracts]);

  function buildTabs() {
    return Object.keys(contracts).map((contractName, key) => {
      key += 1;
      return <Tab label={contractName} {...a11yProps(key)} key={key} />;
    });
  }

  function buildTabContent() {
    return Object.values(contracts).map((contract, key) => {
      let contractName = Object.keys(contracts);
      key += 1;
      return (
        <TabPanel value={value} index={key} key={key}>
          <ContractLayout
            contractName={contractName[key]}
            contractData={contract}
          />
        </TabPanel>
      );
    });
  }

  return (
    <AppLayout title="Celo Starter" description="Celo Starter">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                value={value}
                onChange={handleChange}
                aria-label="basic tabs"
              >
                <Tab label="Account" {...a11yProps(0)} />
                {contracts && buildTabs()}
              </Tabs>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box sx={{ width: "100%" }}>
              <TabPanel value={value} index={0}>
                <AccountInfo></AccountInfo>
              </TabPanel>
              {contracts && buildTabContent()}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h5">Events: </Typography>

            <div
              style={{
                width: "100%",
                border: "1px solid grey",
                height: "100%",
                padding: "0.5rem",
                overflowY: "scroll",
                background: "black",
              }}
            >
              <ContractEventListener config={eventConfig} />
            </div>
          </Grid>
        </Grid>
      </Box>
      <Polling />
    </AppLayout>
  );
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
