# toy-nft-marketplace

- 操作は全てスマコンで行う（ほぼ）フルオンチェーンのNFTマーケットプレイス
  - ローカルでのみ動作
- AssetのみMinioに永続化
- ログイン / ログアウト機能：ログイン・ログアウトを実施
- Sell NFT：NFTをマケプレ上に出品
- それ以外の機能は未実装

## 実行方法

- 事前にWeb3Authでアカウント作っておく
  - `.env.local`内で`NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`を設定する
- マケプレを立ち上げる

```sh
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

- `.env.local`内で出力されたマケプレの`Contract Address`を設定する
  - `NEXT_PUBLIC_MARKET_PLACCE_ADDRESS`
- 生成された`npx hardhat node`で生成されたアカウントをMetamaskに追加する
  - アカウントをインポート
- ※再実行しても変化はないので`npx hardhat node`するたびにやり直す必要はなさそう

- Assetを永続化するためのMinio（パブリック）とNext.jsを立ち上げる

```sh
docker compose up

npm run dev
```

- アプリ内のWeb3Authでは必ずMetamaskを設定する
  - ローカルを利用する場合はSNSログインしてしまうとSaaS上にウォレットが作成されてしまうため

## 参考

- [How to Build a Full Stack NFT Marketplace - V2 (2022)](https://dev.to/edge-and-node/building-scalable-full-stack-apps-on-ethereum-with-polygon-2cfb)
  - ほぼこちらに準拠。ただしTypeScript対応やWeb3Auth対応等の変更点がある
