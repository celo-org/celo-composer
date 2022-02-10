import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";
import { useContractKit } from "@celo-tools/use-contractkit";

import {
  StorageContract,
  GreeterContract,
  TokenContract,
  ShopContract,
  ButtonAppBar,
} from "../components";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function App() {
  const { network } = useContractKit();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const contracts =
    deployedContracts[network?.chainId?.toString()]?.[
      network?.name?.toLocaleLowerCase()
    ]?.contracts;

  return (
    <div>
      <ButtonAppBar />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs">
            <Tab label="Storage" {...a11yProps(0)} />
            <Tab label="Greeter" {...a11yProps(1)} />
            <Tab label="Token" {...a11yProps(2)} />
            <Tab label="Shop" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <StorageContract contractData={contracts?.Storage} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GreeterContract contractData={contracts?.Greeter} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <TokenContract contractData={contracts?.Token} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <ShopContract contractData={contracts?.Shop} />
        </TabPanel>
      </Box>
    </div>
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
