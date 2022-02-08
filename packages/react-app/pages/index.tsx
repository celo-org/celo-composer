import * as React from "react";
import { Tabs, Tab, Typography, Box, Link } from "@mui/material";
import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";
import { useContractKit } from "@celo-tools/use-contractkit";
import { StorageContract, GreeterContract, ButtonAppBar } from "../components";

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
            <Tab label="Storage Contract" {...a11yProps(0)} />
            <Tab label="Greeter Contract" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <StorageContract contractData={contracts?.Storage} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <GreeterContract contractData={contracts?.Greeter} />
        </TabPanel>
      </Box>
      <footer style={{textAlign: "center"}}>
        <Link href="https://github.com/celo-org/celo-progressive-dapp-starter" target="_blank">View source on GitHub</Link>
      </footer>
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
