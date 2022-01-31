# Celo DApp Starter Subgraph

## Requirements

- [The graph cli](https://www.npmjs.com/package/@graphprotocol/graph-cli)
- Contracts deployed with Hardhat with deployment information saved in `packages/hardhat/deployments/hardhat_contracts.json`
- Run `yarn get-abi` to print contract info and save ABI to `packages/subgraphs/abis`

This README was created following [this post](https://docs.celo.org/blog/using-the-graph). Consult it for more detailed information.

Run

```shell
graph init
```

- Select `ethereum` as the protocol.
- Select `hosted-service`
- Name your subgraph following the convention `github-username/subgraph-name`
- Select `celo-alfajores` as the network
- Enter the appropriate contract address (printed when you ran `yarn get-abi`)
- Enter the path to the ABI (also printed when you ran `yarn get-abi`)

`cd` into the new directory

Run

```shell
graph codegen
```

- Create an account at https://thegraph.com/hosted-service.
  - Find more information about deploying a subgraph to the hosted service on the Graph docs [here](https://thegraph.com/docs/en/hosted-service/deploy-subgraph-hosted/#create-a-hosted-service-account).
- Authorize your cli 

```shell
graph auth --product hosted-service <ACCESS_TOKEN>
```

- Deploy

```shell
graph deploy --product hosted-service <GITHUB_USER>/<SUBGRAPH NAME>
```