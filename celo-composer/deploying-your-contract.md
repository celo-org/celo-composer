---
description: >-
  Ready to write a smart contract, interact with it and finally deploy & verify
  it?
---

# 🚀 Deploying Your Contract



{% embed url="https://youtu.be/0pPDzLOS95s" %}

{% hint style="info" %}
Tip: If you have not watched the first video, go back to Installation & Setup to understand how to set up your Celo composer environment and understand its folder structure.
{% endhint %}

## Goal

We are going to write our first smart contract with Celo-composer. Our smart contract will be a simple mintable ERC20 token that is also pausable by the token owner which is you then we will go ahead to verify our smart contract on the Celo testnet Alfajores. Ready? Let's Go  :athletic\_shoe:

### Visit OpenZeppelin Contract Wizard

Open [https://docs.openzeppelin.com/contracts/4.x/wizard](https://docs.openzeppelin.com/contracts/4.x/wizard) in your browser. You will see the contract wizard with the **ERC20** token contract as default, next do the following:

* [ ] Change the Name field to CeloCommunityToken
* [ ] Change the symbol field to CCT
* [ ] In the pre-mint field enter 1000. (This will pre-mint 1000 CCT tokens to your address)
* [ ] In the Features check on Mintable and Pausable (It's adds minting and pausing functionality)

You should be looking at something like this by now

![](<../.gitbook/assets/Screen Shot 2022-08-09 at 9.53.33 PM.png>)

## Create the CeloCommunityToken.sol

Now go back to your code editor, open `packages/hardhat/contracts` and create a `CeloCommunityToken.sol` file. Copy the code from the wizard and paste inside the newly created file.

Now `cd`  from your terminal back to  `packages/hardhat`  install the Openzeppelin library that our smart contract is importing from.&#x20;

Run: code

```bash
yarn add @openzeppelin/contracts -D
```

This will install the open Openzeppelin library, you can check your `node_modules` folder if you would like to inspect the library and browse its code.

Finally, add an extra `modifier` to the `mint` function. Just after  `onlyOwner` modifier add `whenNotPaused` modifier.

## Add Deploy Script

Open `src/hardhat/contracts/deploy/00-deploy.js` and update it with the belwo snippet.

```javascript
  await deploy("CeloCommunityToken", {
    from: deployer,bas
    log: true,
  });
```

Next, update the export to include `CeloCommunityToken`  so it can match below.

```javascript
module.exports.tags = [
  "Greeter",
  "Storage",
  "SupportToken",
  "CeloCommunityToken",
];
```

And finally, in your root folder, run the below command to deploy your newly added smart contract.

```
PRIVATE_KEY={YOUR_PRIVATE_KEY_HERE} yarn hardhat:deploy
```

![](<../.gitbook/assets/Screen Shot 2022-08-09 at 11.56.33 PM.png>)

Above you would see our contract is now being deployed to address `0x2204d0117327A*****` . Your own address will differ from mine, and so is everyone else. Hold down the **cmd/ctrl** and click on  `tx`  in your terminal, it will open up the transaction details page on Celo Alfajores explorer using the transaction hash to search.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 12.13.16 AM.png>)

As you can see in the image above, our new contract was created and immediately minted 1,000 CCT tokens to our address. To view this balance, open your Metamask, click import tokens then copy the smart contract address and paste it into the field that says `Token Contract Address`  the rest will auto fill itself.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 12.45.51 AM.png>)

Now you should see your 1,000 CCT token balance.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 12.44.23 AM.png>)

## Interact with Contract UI

Celo composer comes with a contract component that allows you call and transact with the functions of the smart contract without having to write a single line of code. If you don't have your react app front end included in Celo composer running by now, in a new terminal on the celo composer project root directory run:

```bash
yarn react-app:dev
```

Open http://localhost:3000 on your browser and click on the **CeloCommunnityToken** tab, you will see all of the public functions of the smart contracts that you can execute.&#x20;

* The functions marked view are readonly functions that don't cost us gas fees.
* The non payable functions make changes to the contract states but are not payable i.e. do not direct accept CELO if you send it to them.
* The functions marked payable are state-changing functions and require that yous end CELO to them while calling it.

View functions have **call** buttons while state-changing functions such as payable and non payable ones have buttons called transact.



## **Perform the following tasks:**

* [ ] Call the **name** (view) **** function. what does it return?
* [ ] Call the **balanceOf** (view) function and pass your Metamask **Account 1** wallet address to it. What does it return?
* [ ] Click on **owner** (view) function. Do you see your **Account 1** wallet address returned?
* [ ] Open Metamask, create **Account 2** following the image below

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 1.12.51 AM.png>)

* [ ] Copy the address of **Account 2**. and paste it inside the **to** input field of the new token and in the **amount** paste this 1000000000000000000000. Check the CCT balance of **Account 2**, if you can't view it import the contract token again to view it. Do you see 1000 CCT minted for the account?
* [ ] Call the **balanceOf** (view) function and pass your Metamask **Account 1** wallet address to it. What does it return?
* [ ] Open your browser console and open the javascript console tab.
* [ ] Click on **pause** function, and after the transaction, succeeds. Try to mint some tokens again for **Account 2** by following the previous step**.** You will notice it will fail with details logged in the console and when you inspect closely it will show you the reason as **Pausable: paused**. This was because of the **whennotPaused** modifier that only allows us to call the function when the contract is not paused. This is usually used as a security measure in case the contract was compromised.
* [ ] Click on **unpause** function and approve the Metamask transaction and everything should be back to normal.
