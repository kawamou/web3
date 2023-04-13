import { Web3Auth } from "@web3auth/modal";
import type { SafeEventEmitterProvider } from "@web3auth/base";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// https://web3auth.io/docs/pnp/features/server-side-verification/social-login-users
// 注意: IDトークンの検証等は行っておらずかなり書き捨てコードです
// 触った肌感としてはただのログイン機能としてもWeb3Authは使えるので鍵とか取りたい場合はweb3.jsやethers.jsを使う
// この流れはWeb3Modalとかと同じなので定番の流れだろう
// ref. https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb
export const useAuth = (): [
  () => Promise<Web3Auth | undefined>,
  () => Promise<boolean>,
  (provider: SafeEventEmitterProvider) => Promise<void>,
  () => Promise<void>,
  () => ethers.providers.JsonRpcSigner | undefined,
  () => Promise<string> | undefined,
  () => Promise<string | undefined>
] => {
  const [web3Auth, setWeb3Auth] = useState<Web3Auth>();
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  // connect()でモーダルが表示される
  // ただしconnect()はtsx側で呼び出さないと表示されなかったため
  // インスタンスを返して呼び出してもらうちょっと汚い運用に
  // その他のメソッドの説明は下記↓
  // https://web3auth.io/docs/sdk/web/modal/usage
  // https://web3auth.io/docs/connect-blockchain/polygon#installation
  const initAuth = async () => {
    const newWeb3Auth = new Web3Auth({
      clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? "",
      chainConfig: {
        chainNamespace: "eip155",
        chainId: "0x13881",
        rpcTarget: "https://rpc.ankr.com/polygon_mumbai",
      },
    });
    await newWeb3Auth?.initModal();
    setWeb3Auth(newWeb3Auth);

    return newWeb3Auth;
  };

  // メチャクチャ適当なログイン状態
  const isLogin = async () => {
    const userInfo = await web3Auth?.getUserInfo();
    console.log("=========");
    console.log(userInfo);
    console.log("=========");
    return userInfo?.email ? true : false;
  };

  const login = async (provider: SafeEventEmitterProvider) => {
    setProvider(new ethers.providers.Web3Provider(provider));
  };

  const getUserInfo = async () => {
    if (!web3Auth) return;
    return await web3Auth.getUserInfo();
  };

  const getSigner = () => {
    if (!provider) return;
    return provider.getSigner();
  };

  const getAddress = () => {
    if (!provider?.getSigner()) return;
    return provider.getSigner().getAddress();
  };

  const getBalance = async () => {
    const address = getAddress();
    if (!address || !provider) return;
    return ethers.utils.formatEther(await provider.getBalance(address));
  };

  const logout = async () => {
    if (!web3Auth) return;
    await web3Auth.logout();
    setWeb3Auth(undefined);
  };

  return [initAuth, isLogin, login, logout, getSigner, getAddress, getBalance];
};
