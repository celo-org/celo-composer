---
description: Quick and up to speed setup with celo composer
---

# 📥 Installation & Setup

{% embed url="https://www.youtube.com/watch?v=P53FAY0FM40" %}

{% hint style="info" %}
To build your dapp, you'll need to install the dependencies, create a new project, and run the following commands:\
\
**Prerequisites :**&#x20;

* Node (version > 14)
* Yarn
* Git
{% endhint %}

## Clone repository

Open your terminal of choice, navigate to your project folder and run the blow command

```bash
git clone https://github.com/celo-org/celo-composer
cd celo-composer
```

## Install Metamask

Visit [https://metamask.io](https://metamask.io) to install Metamask as our non-custodian wallet to hold Celo and interact with our Dapps.

* Visit the download page of metamask.io
* Next, install your browser version of metamask
* Open metamask
* Setup a new account (create a wallet)
* Important! Backup your secret mnemonic offline in a secure location

{% hint style="info" %}
You can pin the Metamask extension to your browser at the top right part. So you can easily access it.
{% endhint %}

## Visit Faucet to Get Test Token

Visit [https://celo.org/developers/faucet](https://celo.org/developers/faucet) to get some test tokens for your wallet. The test faucet will give you 1 CELO native token, 1 cUSD token (Celo stable token tracking the USD), 1 cEUR token (Celo stable token tracking EUR), 1 cREAL token (Celo stable token tracking the Brazilian Real). \
\
To get this token, copy your Metamask **Account 1** Address and paste it into the field that says Testnet address. Complete the robot verification and request your tokens by clicking **Get Started**.

## Verify Token Balance

Visit [https://alfajores-blockscout.celo-testnet.org](https://alfajores-blockscout.celo-testnet.org). Top the top right corner, paste your Metamask **Account 1** address inside of it then hit the enter button to search for your address.&#x20;

Example of how your wallet address and token will be displayed on the Celo explorer.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 1.27.14 AM.png>)

## Add Celo Testnet to Metamask

By now you will realize you can only view your Celo balances from only the explorer and it's not showing yet on your Metamask wallet, more weird thing is you are seeing ETH and not CELO. Let us solve that issue.\
\
Visit [https://chainlist.org](https://chainlist.org) to add Alfajores network to Metamask, first toggle the testnet button to display testnet networks and then search for Alfajores.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 1.32.06 AM.png>)

Next click on **connects the wallet** to enable the website to link with your Metamask wallet. Now the Add to Metamask wallet button will show up, now click that to add Alfajores network configuration to Metamask. &#x20;

## Run Yarn Install

Now open the celo-composer project you recently cloned and in the root of the folder run&#x20;

```
yarn install
```

From your terminal, this will download all required dependencies for the whole project. There is more than one **package.json** in the project but you only need to run it once from the root directory.\


![](<../.gitbook/assets/Screen Shot 2022-08-08 at 1.45.10 AM.png>)

{% hint style="info" %}
Look through the **packages** folder to see the list of frameworks supported. You will notice hardhat for smart contracts, react-app a Nextjs setup for react frontend, react native and flutter-app setups.
{% endhint %}

## Compile & Watch Your Contracts

Once the `yarn install` command is done, now run the command. Next, open your Metamask wallet, and click on the three dots beside **Account 1 -> Account Details -> Export Private Key.**&#x20;

Provide your Metamask password and copy your private key, then run the command below with the _{YOUR\_PRIVATE\_KEY\_HERE_} value replaced without the curly brace added.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 1.58.22 AM.png>)

```
PRIVATE_KEY={REPLACE_YOUR_PRIVATE_KEY} yarn hardhat:watch
```

This command compiles all contracts in **packages/hardhat** and watches them for changes to recompile them if any new contract is added or the existing one is modified. \


![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.05.13 AM.png>)

As you can see below, it is deploying our smart contract using **Account 1** and our CELO balance has been reduced, this is because of the gas fee we paid for the smart contract deployment. You can view the same thing on your wallet details on the explorer page.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.05.37 AM.png>)

## Start up your Frontend

Open a second terminal while the former command is left running uninterruptedly and run the command below to launch the react UI.\


```bash
yarn react-app:dev
```

This will launch the app on port 3000 if it's not yet occupied by another running process. Visit [https://localhost:3000](https://localhost:3000) in your browser where you have the Metamask wallet installed.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.10.38 AM.png>)

By, default without connecting your wallet, the app loaded will look something like this.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.16.24 AM.png>)

To start interacting with your app, click on **CONNECT WALLET** button to the top right of the app. Select Metamask and that's it.

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.18.20 AM (1).png>)

## Account Info Displayed

Once your wallet is connected and you are on Celo Alfajores network, the Account Details tab will show a summary of **Account 1** balances.&#x20;

![](<../.gitbook/assets/Screen Shot 2022-08-08 at 2.18.51 AM.png>)

Congratulations on your first interaction with Celo composer :tada::tada::tada:.&#x20;



Move on to the next lesson&#x20;

