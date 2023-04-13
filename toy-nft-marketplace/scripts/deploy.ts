import hre from "hardhat";

(async () => {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy();
  await nftMarketplace.deployed();
  console.log("nftmarketplace deployed to:", nftMarketplace.address);
})();
