"use client";

import React, { useEffect, useState } from "react";
import { BaseProvider } from "@metamask/providers";
import { Maybe } from "@metamask/providers/dist/utils";
import { ethers } from "ethers";
import abi from "../utils/WavePortal.json";
import { WavePortal } from "../../../typechain-types/WavePortal";
import { on } from "events";

// https://zenn.dev/thanai/scraps/4c94c04bdc8373
declare global {
  interface Window {
    ethereum: BaseProvider;
  }
}

// MetaMaskは、誤解を恐れず一言で説明すると、ブラウザのwindowオブジェクトにethereumというオブジェクトをセットすることで、Webアプリがそのwindow.ethereumオブジェクトを利用してEthereumブロックチェーンの操作することを可能にしています。
const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    if (!ethereum) {
      console.error("make sure you have metamask!");
      return null;
    }

    console.log("we have the ethereum object", ethereum);
    const accounts: Maybe<string[]> = await ethereum.request({
      method: "eth_accounts",
    });

    if (
      accounts &&
      accounts.every(
        (x): x is string => typeof x === "string" && x !== undefined
      )
    ) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("no authorized account found");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const [allWaves, setAllWaves] = useState<
    {
      waver: String;
      timestamp: ethers.BigNumber;
      message: String;
    }[]
  >([]);

  const contractAddress = "0x5AFa88aFc28B587736986a6D6C2Ed375cD619f89";
  const contractABI = abi.abi;

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as WavePortal;

        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned: {
          waver: String;
          timestamp: ethers.BigNumber;
          message: String;
        }[] = waves.map((wave) => {
          return {
            waver: wave.waver,
            timestamp: wave.timestamp,
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let wavePortalContract: WavePortal;

    const onNewWave = (
      from: String,
      timestamp: ethers.BigNumber,
      message: String
    ) => {
      console.log("new wave", from, timestamp, message);
      setAllWaves((prev) => [...prev, { waver: from, timestamp, message }]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ) as WavePortal;
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("get metamask!");
        return;
      }

      const accounts: Maybe<string[]> = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (
        accounts &&
        accounts.every(
          (x): x is string => typeof x === "string" && x !== undefined
        )
      ) {
        console.log("connected", accounts[0]);
        setCurrentAccount(accounts[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // WalletをGoeriに切り替えておく必要がある
  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        ) as WavePortal;

        console.log("aaa: ", wavePortalContract);

        let count = await wavePortalContract.getTotalWaves();
        console.log("retrieve total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave("this is message");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("retrieve total wave count...", count.toNumber());
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findMetaMaskAccount().then((account) => {
      if (account !== null) {
        setCurrentAccount(account);
        getAllWaves();
      }
    });
  }, []);

  return (
    <div className="">
      <div>
        <div>👋 Hey there!</div>
      </div>
      <div>
        {`I am Farza and I worked on self-driving cars so that's pretty cool
        right? Connect your Ethereum wallet and wave at me!`}
      </div>

      <button onClick={wave}>Wave at Me</button>

      {!currentAccount && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}

      {allWaves.map((wave, index) => {
        return (
          <div
            key={index}
            style={{
              backgroundColor: "OldLace",
              marginTop: "16px",
              padding: "8px",
            }}
          >
            <div>address: {wave.waver}</div>
            <div>time: {wave.timestamp.toNumber()}</div>
            <div>message: {wave.message}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
