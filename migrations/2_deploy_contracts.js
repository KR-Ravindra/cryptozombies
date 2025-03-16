var SafeMath = artifacts.require("./safemath.sol");
var ZombieFactory = artifacts.require("./zombiefactory.sol");
var ZombieFeeding = artifacts.require("./zombiefeeding.sol");
var ZombieHelper = artifacts.require("./zombiehelper.sol");
var ZombieAttack = artifacts.require("./zombieattack.sol");
var ZombieOwnership = artifacts.require("./zombieownership.sol");

module.exports = async function(deployer) {
  await deployer.deploy(SafeMath);
  await deployer.link(SafeMath, [ZombieFactory, ZombieFeeding, ZombieHelper, ZombieAttack, ZombieOwnership]);

  await deployer.deploy(ZombieFactory);
  await deployer.deploy(ZombieFeeding);
  await deployer.deploy(ZombieHelper);
  await deployer.deploy(ZombieAttack);
  await deployer.deploy(ZombieOwnership);
};