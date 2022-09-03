<h1 align="center">Angular Web3 Template.</h1>

<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" alt="angular-logo" width="120px" height="120px"/>
  <br>
  <i>Now you can easily add crypto dependencies and implement solutions 
    <br>Using the power of Angular.</i>
  <br>
</p>






This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also
use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Dependencies

- [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- [Wallet Connect Provider](https://www.npmjs.com/package/@walletconnect/web3-provider)
- [web3modal](https://www.npmjs.com/package/web3modal)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

## Provider
This Dapp use web3modal allow us to use more wallet connectors
you can get more info [here](https://github.com/Web3Modal/web3modal)

## Get infura key

Create an infura account [here](https://infura.io/)
in web3.serrvice.ts line 31 insert your key in infuraId: ''

## Change Network

in ``web3.serrvice.ts`` line 56 you can change the network to your desire net
to  ``network: "mainnet",`` or ``network: "rinkeby",`` or ``network: "ropsten",``


## Dependencies and changes to common Angular App

**tsconfig.json**

```json 
  "compilerOptions": {
    "paths":{
      "crypto": ["./node_modules/crypto-browserify"],
      "stream": ["./node_modules/stream-browserify"],
      "assert": ["./node_modules/assert"],
      "http": ["./node_modules/stream-http"],
      "https": ["./node_modules/https-browserify"],
      "url": ["./node_modules/url"],
      "os": ["./node_modules/os-browserify"],
    },
    ....
    ....
  "angularCompilerOptions": {
    "allowSyntheticDefaultImports": true,
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "noImplicitAny": false,
    "strictTemplates": true,
    "strictNullChecks": false
  }

```

