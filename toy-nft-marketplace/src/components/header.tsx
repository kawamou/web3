import Link from "next/link";

const Header = () => {
  return (
    <nav className="border-b border-gray-600 p-6">
      <p className="text-4xl font-bold">Marketplace</p>
      <div className="flex mt-4">
        <Link href="/" className="mr-4 text-blue-500">
          Home
        </Link>
        <Link href="/create_nft" className="mr-6 text-blue-500">
          Sell NFT
        </Link>
        <Link href="/" className="mr-6 text-blue-500">
          My NFTs
        </Link>
        <Link href="/" className="mr-6 text-blue-500">
          Dashboard
        </Link>
        <Link href="/auth" className="mr-6 text-blue-500">
          Login / Logout
        </Link>
      </div>
    </nav>
  );
};

export default Header;
