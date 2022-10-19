# 🔬 Verifying Your Contract

## Step 1

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 1.40.43 AM.png>)

On the **CELOCOMMUNITYTOKEN** Tab, Click on the deployed contract to view the contract page on Celo explorer one more time then click on the code tab.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 1.44.30 AM.png>)

Notice all we can view right now is the bytecode of the smart contract, hmmm... you will also agree that it looks gibberish to you right now, right? Now let us verify our contract so that we can see the code of our smart contract instead and people using our smart contract can also view the code so they know we are not executing any malicious code.

## Step 2

Now you need to get your Celo scan API key. To do so, visit [https://celoscan.io](https://celoscan.io) sign up for a new account, verify your email address, and log in to Celo scan. Once you are logged in, visit [https://celoscan.io/myaccount](https://celoscan.io/myaccount), and to your left, click on API Keys menu to generate a new API Key, name it anything you want then copy the generated key somewhere for our use soon.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 3.46.22 AM.png>)

## Step 3

Now we need to install a hardhat package for verifying smart contracts. In your `/packages/hardhat` path run the below command to add the Etherscan package.&#x20;

```
yarn add @nomiclabs/hardhat-etherscan -D
```

In `packages/hardhat/hardhat.config.js` add this required statement at the top of the script just below the other required statements.

```
require("@nomiclabs/hardhat-etherscan");
```

Next update the `hardhat.config.js` to reflect these changes

```
etherscan: {
    apiKey: {
      alfajores: {CELO_SCAN_API_HERE_WITHOUT_THE_BRACES},
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
    ],
  },
```

We needed these extra configs because hardhat doesn't fully support deploying to Celo out of the box as it does to Etherscan. So to confirm our custom chains were properly registered. run

```
PRIVATE_KEY={YOUR_PRIVATE_KEY_HERE_WITH_NO_CURLY_BRACES_INCLUDED} npx hardhat verify --list-networks
```

You should see them listed as seen below

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 4.02.00 AM.png>)

Now we can finally run the command to verify our CeloCommunityToken contract. To do so run

```
PRIVATE_KEY={YOUR_PRIVATE_KEY_HERE_WITH_NO_CURLY_BRACES_INCLUDED} npx hardhat verify --network alfajores {REPLACE_YOUR_CONTRACT_ADDRESS_HERE}
```

Awesome :clap: You did it! \
\
If you go back to view your contract page on explorer and click the **Code** tab, it should now be showing verified and allow you and others to read and interact with the code. Now everyone knows exactly what your smart contract does and that nothing fishy is happening behind.

But be careful, **with much power comes more responsibility**, your code verified means others can sight a loophole in your contract if care is not taken and take advantage of it which may lead to loss of funds.

![](<../.gitbook/assets/Screen Shot 2022-08-10 at 4.11.18 AM.png>)

{% hint style="warning" %}
If you ever run into any error about build/artifacts when verifying your smart contract. Just simply delete your artifact and cache directory then rerun the command and that should fix it.
{% endhint %}
