import * as hre from "hardhat";

// hardhatのテストスクリプトでは新しいローカルイーサリアムネットワークを作り、実行後に自動破棄されている
// 継続的なNodeを作るには`npx hardhat node`
// Nodeに対してブロックを生成する
// npx hardhat run scripts/deploy.ts --network localhost

// ❯ npx hardhat run scripts/deploy.ts --network goerli
// deoloying contracts with account: xxx
// account balance: xxx
// waveportal address: 0xE19d7aFb59535de2FC9620afEe2db9ADB24E6684

const main = async () => {
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();

  console.log("waveportal address: %s", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
};

runMain();
