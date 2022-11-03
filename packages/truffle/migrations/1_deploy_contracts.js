const Greeter = artifacts.require("Greeter");

module.exports = function (deployer) {
  deployer.deploy(Greeter, "Hello World!");
};
