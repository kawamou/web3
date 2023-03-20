import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { task } from "hardhat/config";
import * as dotenv from "dotenv";
import "@nomiclabs/hardhat-ethers";

dotenv.config();

task("accounts", "prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: process.env.QUICKNODE_API_URL,
      accounts: [process.env.PRIVATE_GOERLI_ACCOUNT_KEY ?? ""],
    },
  },
};

export default config;
