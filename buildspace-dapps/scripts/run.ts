import * as hre from "hardhat";

const main = async () => {
  // コントラクト操作のために必要なファイルが生成される？
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // 実際にデプロイを実施
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  // デプロイされるまで待つ
  await waveContract.deployed();
  // ❯ npx hardhat run scripts/run.ts
  // Compiled 2 Solidity files successfully
  // Yo yo, I am a contract and I am smart
  // Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  console.log("Contract deployed to:", waveContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const waveTxn = await waveContract.wave("this is wave #1");
  await waveTxn.wait();

  // const waveTxn2 = await waveContract.wave("this is wave #2");
  // await waveTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
};

const runMain = async () => {
  try {
    await main();
  } catch (error) {
    console.log(error);
  }
};

runMain();
