import * as hre from "hardhat";

const main = async () => {
  // コントラクト操作のために必要なファイルが生成される？
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  // 実際にデプロイを実施
  const waveContract = await waveContractFactory.deploy();
  // デプロイされるまで待つ
  await waveContract.deployed();
  // ❯ npx hardhat run scripts/run.ts
  // Compiled 2 Solidity files successfully
  // Yo yo, I am a contract and I am smart
  // Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  console.log("Contract deployed to:", waveContract.address);

  let waveCount;
  // 一度デプロイするとTypeChain？が走り型定義ファイルが生まれる
  // これによりwaveContractにgetTotalWaves等のメソッドが生える
  waveCount = await waveContract.getTotalWaves();
  console.log(waveCount.toNumber());

  let waveTxn = await waveContract.wave("a message!");
  await waveTxn.wait();

  // コントラクトをデプロイする人のアドレス
  // テスト的にHardhat Networkに存在するアカウントリストから抽出
  // scripts配下に書いてるのはあくまでテストなので
  const [_, randomPerson] = await hre.ethers.getSigners();
  waveTxn = await waveContract.connect(randomPerson).wave("another message!");
  await waveTxn.wait();

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
