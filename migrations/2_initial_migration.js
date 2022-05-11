const ERC721SmartContract = artifacts.require("ERC721SmartContract");

module.exports = function (deployer) {
  deployer.deploy(ERC721SmartContract);
};
