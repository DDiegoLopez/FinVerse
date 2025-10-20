import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";

const Header = async () => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/images/finverse1.webp"
            alt="Signalist logo"
            width={150}
            height={150}
            className="cursor-pointer"
          />
        </Link>
        <div className="sm:hidden">
          <SearchCommand
            renderAs="text"
            label="Search"
            initialStocks={initialStocks}
          />
        </div>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </div>
    </header>
  );
};
export default Header;
