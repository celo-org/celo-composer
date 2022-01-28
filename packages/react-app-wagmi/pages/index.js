import {
  Provider,
  chain,
  useAccount,
  useConnect,
  useNetwork,
  useBlockNumber,
  useContract,
  useContractRead,
  useContractWrite,
  useSigner,
} from "wagmi";

import { useState } from "react";

import {
  Card,
  Space,
  Input,
  Button,
  notification,
  Form,
  Col,
  Row,
  Divider,
  Tabs,
} from "antd";
import "antd/dist/antd.css";

const { TabPane } = Tabs;

import deployedContracts from "../../hardhat/deployments/hardhat_contracts.json";

export default function App() {
  const [{ data: connectData, error: connectError, connectLoading }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData, error: networkError, loading }, switchNetwork] =
    useNetwork();

  let contracts

  console.log('connect loading', networkData)

  if (networkData.chain) contracts = getContractData(networkData?.chain);

  if (accountData) {
    return (
      <Row justify="space-around" align="middle" style={{ height: "300px" }}>
        <Col span={16}>
          <Space wrap size="small">
            <Card title="Connection Info">
              <p>Account address: {accountData.address}</p>
              <p>Connected to {networkData.chain?.name}</p>
              <p>Connected via {accountData.connector.name}</p>
              <Button onClick={disconnect}>Disconnect</Button>
            </Card>
            {contracts ? <Contracts contracts={contracts} /> : <></>}
          </Space>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="space-around" align="middle" style={{ height: "300px" }}>
      <Col span={6}>
        <Space wrap>
          {connectData.connectors.map((x) => (
            <Button type="primary" key={x.id} onClick={() => connect(x)}>
              {x.name}
              {!x.ready && " (unsupported)"}
            </Button>
          ))}

          {connectError && (
            <div>{connectError?.message ?? "Failed to connect"}</div>
          )}
        </Space>
      </Col>
    </Row>
  );
}

const Contracts = (props) => {
  return (
    <Space direction="vertical">
      <Card title="Custom Contracts">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Storage" key="1">
            <StorageContract contract={props.contracts.Storage} />
          </TabPane>
          <TabPane tab="Greeter" key="2">
            <GreeterContract contract={props.contracts.Greeter} />
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

const getContractData = (network, name) => {
  return deployedContracts[network?.id.toString()]?.[
    network?.name?.toLocaleLowerCase()
  ].contracts;
};

const StorageContract = (props) => {
  const [{ data, error, loading }, getSigner] = useSigner();
  const [number, setNumber] = useState();

  let config = {
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
  };

  const contract = useContract({ ...config, signerOrProvider: data });

  const retrieve = async () => {
    console.log(contract)
    const number = (await contract.retrieve.call()).toString();
    setNumber(number);
    notification.open({
      message: "Retrieved value",
      description: `Contract storage retrieved: ${number}`,
    });
  };

  const setStorage = async (values) => {
    let tx = await contract.store(values.number);

    notification.open({
      message: "Updating Storage",
      description: `Contract storage updating to: ${values.number}`,
    });

    let receipt = await tx.wait();
    console.log("receipt", receipt);

    notification.open({
      message: "Storage Updated",
      description: `Contract storage updated to: ${values.number}`,
    });
  };

  return (
    <Space direction="vertical">
      <h2>Storage Contract</h2>
      <p>Contract Address: {contract.address}</p>
      <p>Contract number: {number}</p>
      <Button onClick={retrieve}>Retrieve number</Button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={setStorage}
        autoComplete="off"
      >
        <Form.Item
          label="New storage value"
          name="number"
          rules={[
            { required: true, message: "Please input new storage value" },
          ]}
        >
          <Input placeholder="Set new storage value"></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Set Storage
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

const GreeterContract = (props) => {
  const [{ data, error, loading }, getSigner] = useSigner();
  const [greeting, setGreeting] = useState("");

  let config = {
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
  };

  const contract = useContract({ ...config, signerOrProvider: data });

  const greet = async () => {
    const greeting = await contract.greet();
    setGreeting(greeting);
    notification.open({
      message: "Retrieved Greeting",
      description: `${greeting}`,
    });
  };

  const set = async (values) => {
    let tx = await contract.setGreeting(values.greeting);

    notification.open({
      message: "Updating Greeting",
      description: `Contract greeting updating to: ${values.greeting}`,
    });

    let receipt = await tx.wait();
    console.log("receipt", receipt);

    notification.open({
      message: "Greeting Updated",
      description: `Contract greeting updated to: ${values.greeting}`,
    });
  };

  return (
    <Space direction="vertical">
      <h2>Greeter Contract</h2>
      <p>Contract Address: {contract.address}</p>
      <p>Contract greeting: {greeting}</p>
      <Button onClick={greet}>Retrieve greeting</Button>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={set}
        autoComplete="off"
      >
        <Form.Item
          label="New greeting"
          name="greeting"
          rules={[{ required: true, message: "Please input new greeting" }]}
        >
          <Input placeholder="Set new greeting"></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Set Greeting
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};
