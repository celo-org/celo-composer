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
} from "antd";
import "antd/dist/antd.css";

import deployedContracts from "../../contracts/hardhat_contracts.json";

export default function App() {
  const [{ data: connectData, error: connectError }, connect] = useConnect();
  const [{ data: accountData }, disconnect] = useAccount();
  const [{ data: networkData, error: networkError, loading }, switchNetwork] =
    useNetwork();

  let storageContract = {
    address: "",
    abi: [],
  };

  if (!loading)
    storageContract = getContractData(networkData?.chain, "Storage");

  if (accountData) {
    return (
      <Space wrap size="small">
        <Card title="Connection Info">
          <p>Account address: {accountData.address}</p>
          <p>Connected to {networkData.chain?.name}</p>
          <p>Connected via {accountData.connector.name}</p>
          <Button onClick={disconnect}>Disconnect</Button>
        </Card>
        {storageContract ? <Contract contract={storageContract} /> : <></>}
      </Space>
    );
  }

  return (
    <Row justify="space-around" align="middle" style={{"height": "300px"}}>
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

const Contract = (props) => {
  const [{ data, error, loading }, getSigner] = useSigner();
  const [number, setNumber] = useState();

  let config = {
    addressOrName: props.contract.address,
    contractInterface: props.contract.abi,
  };

  const contract = useContract({ ...config, signerOrProvider: data });

  const retrieve = async () => {
    const number = (await contract.retrieve()).toString();
    setNumber(number);
    notification.open({
      message: "Retrieved value",
      description: `Contract storage retrieved: ${number}`,
    });
  };

  const setStorage = async (values) => {
    await contract.store(values.setStorage);
    notification.open({
      message: "Updating Storage",
      description: `Contract storage updating to: ${values.setStorage}`,
    });
  };

  return (
    <Space direction="vertical">
      <Card title="Custom Contract">
        <Space direction="vertical">
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
              name="setStorage"
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
      </Card>
    </Space>
  );
};

const getContractData = (network, name) => {
  return deployedContracts[network?.id]?.[network?.name?.toLocaleLowerCase()]
    .contracts[name];
};
