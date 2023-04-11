// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// ERC721URIStorageを継承
// npx hardhat testにてテスト
contract NFTMarketplace is ERC721URIStorage {
    // この定義をしておけばCounters.Counter型の変数に対して
    // increment()やcurrent()などの関数を使えるようになる
    // 便利メソッド生えているからCounters.Counter型を利用
    // グローバルな変数はストレージ領域にて永続化される
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    // key-value
    mapping(uint256 => MarketItem) private idToMarketItem;

    // この文脈ではpayableはaddress型に関連付けられた修飾子
    // このアドレスがEtherを受け取ることを示している
    // スマコンの関数を通じてEtherを受け取ることができる
    // 別に各関数内でこのaddressはpayableって定義しても良いけど
    // ここで定義しとけば取り回ししやすい
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    // トークンが作成された後に発火させるイベントログ
    // DAppsや他のスマコンが監視 / リアクトできるように定義
    // イベントはトランザクションの一部としてブロックチェーンに記録
    // tokenIdにインデックスを付けている（イベントリッスン時等に指定可能？）
    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // msg.sender = スマコン実行した方。ただのaddress型ではなくpayable修飾子がついているので囲う
    // スマコン作成時に一度だけ呼び出される
    constructor() ERC721("NFTMarketplace", "NFT") {
        owner = payable(msg.sender);
    }

    // リスト（NFTを）の価格を更新する
    function updateListingPrice(uint _listingPrice) public payable {
        // requireがfalseの際のログはクライアントに返却されるのみで永続化はされない
        // ガード節
        require(
            msg.sender == owner,
            "only marketplace owner can update listing price"
        );
        listingPrice = _listingPrice;
    }

    // リスト（出品）の価格を取得する
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // トークンを作成し、マーケットにリストする
    // 新しいトークンIDをもとにNFTを作成しURLを設定
    // その後内部的にcreateMarketItemを呼び出す
    // public: どこからでも呼び出し可能
    // payable: Ether受け取り可能
    // returns(uint): 戻り値としてuint型を返す
    // memory: 一時的なデータストレージ。関数終了時に破棄
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    // トークンをマーケットにリストする（プライベートなので同一スマコンのみ呼び出し可能）
    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "listing price must be equal to listing price"
        );

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            // address(this) = このスマコンのアドレス
            payable(address(this)),
            price,
            false
        );

        // 所有者を移行
        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    // トークンの再販を設定する
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "only item owner can perform this operation"
        );
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    // トークンを購入する
    function createMarketSale(uint256 tokenId) public payable {
        uint price = idToMarketItem[tokenId].price;
        address seller = idToMarketItem[tokenId].seller;
        require(
            msg.value == price,
            "please submit the asking price in order to complete the purchase"
        );
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        // 売り手にゼロアドレスを指定
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
        // ownerにリスト価格を送金
        payable(owner).transfer(listingPrice);
        // sellerに購入価格を送金
        payable(seller).transfer(msg.value);
    }

    // 購入可能なマーケットアイテムを取得する
    // _itemsSoldで売り切れたアイテムを管理しているので除外
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        // 関数内で宣言された変数はデフォルトでmemoryになる
        // memoryの配列は必ずサイズを指定して作成する必要がある
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // ユーザが所有するNFTを取得する
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // ユーザがリストに登録したアイテムを取得する
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = i + 1;
                // storage修飾子のついたMarketItem型であることを明示的に指定
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
