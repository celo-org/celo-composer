import * as React from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import deployedContracts from "@celo-composer/hardhat/deployments/hardhat_contracts.json";
import { useCelo } from "@celo/react-celo";
import { StorageContract, GreeterContract, AccountInfo, Polling } from "@/components";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect } from "react";
import { ContractLayout } from "@/components/contract-components"

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function App() {
  const { network } = useCelo();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

    console.log(contracts);

  function buildTabs() {
    return (
      Object.keys(contracts).map((contractName,key)=>{
        key += 1;
        return <Tab label={contractName} {...a11yProps(key)} />
      })
    )
  }

  function buildTabContent(){
     return (
      Object.values(contracts).map((contract,key)=>{
        let contractName = Object.keys(contracts);
        key += 1;
        return (
          <TabPanel value={value} index={key}>
        <ContractLayout contractName={contractName[key]} contractData={contract}/>
        </TabPanel>
        )
      })
    )
  }

  return (
    <AppLayout title="Celo Starter" description="Celo Starter">
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs variant="scrollable" scrollButtons allowScrollButtonsMobile value={value} onChange={handleChange} aria-label="basic tabs">
            <Tab label="Account" {...a11yProps(0)} />
            {
             contracts && buildTabs()
            }
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <AccountInfo></AccountInfo>
        </TabPanel>
        {contracts && buildTabContent()}
      </Box>
      <Polling/>
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
