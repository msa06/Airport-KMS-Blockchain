const AirportDatabase = artifacts.require("AirportDatabase");

module.exports = function(deployer) {
  deployer.deploy(AirportDatabase);
};
