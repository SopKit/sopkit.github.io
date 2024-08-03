import { Search } from "./SearchBox";
import Link from "next/link";
import Tools from "./Tools";
export default function Home() {
  return (
    <>
      {/* Create a search box in middle of the page  */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col align-middle justify-center cover -mt-10 mb-10 text-center">
            <img
              src="https://github.com/sopkit.png"
              alt="Search"
              width={100}
              height={100}
              className="rounded-full mb-1  self-center"
            />
            <br />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              {" "}
              SopKit{" "}
            </h1>
            <br />
            <p className="text-muted-foreground md:text-xl">
              Explore our suite of free online tools and utilities to streamline
              your JavaScript development workflow.
            </p>
            <p>
              <Link href="https://www.google.com/search?q=site%3Ahttps%3A%2F%2Fsopkit.github.io+markdown+to+html">
                Search SopKit Tools on Google
              </Link>
            </p>
          </div>

          <div id="searchfield" className=" w-full md:w-2/4 ">
            <Search />
          </div>
          <div className=" w-full mt-40  ">
            <h1 className=" text-2xl ">Top Tools</h1>
            <Tools />
          </div>
        </div>
      </div>
    </>
  );
}
