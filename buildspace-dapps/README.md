# Sample Hardhat Project

## 開発の流れ

- Solidityでコントラクトを書く
- Hardhatでデプロイする（合わせてコンパイルされる）
- React（Dapps）からコントラクトアドレスを参照しABIを元に呼び出す
  - `npx hardhat run scripts/deploy.ts --network goerli` 実行時にアドレスが表示
  - `artifacts > contracts > WavePortal.sol > WavePortal.json` のABIを利用

## 実行方法

- client: `npm run dev`

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
