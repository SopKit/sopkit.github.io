import { Search } from "./SearchBox";
import Footer from "./_compo/Footer";
import Header from "./_compo/Header";

export default function Home() {
  return (
    <>
      {/* Create a search box in middle of the page  */}
          <Header />
      <div className="flex justify-center items-center h-screen">
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
            <h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              {" "}
              SopKit{" "}
            </h1>
            <br />
            <p className="text-muted-foreground md:text-xl">
              Explore our suite of free online tools and utilities to streamline your JavaScript development workflow.
            </p>


          </div>

          <div id="searchfield" className=" w-full md:w-2/4 ">
            <Search />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
