import Image from "next/image";
import Link from "next/link";
import examples from "@/examples.json";
import { SimpleBar } from "@/app/SimpleBar";

export default function Home() {
  return (
    <main className="h-screen flex justify-center items-center w-screen bg-[#e0e2e7] p-2 md:p-20">
      <div className="hidden md:fixed top-8 right-8 md:block">
        <Link
          href={"https://github.com/luzhenqian/web3-examples"}
          target="_blank"
        >
          <GitHubIcon />
        </Link>
      </div>

      <SimpleBar className="w-full h-full rounded-lg md:rounded-3xl">
        <div
          className="flex flex-col w-full h-full gap-4 p-4 overflow-auto rounded-lg shadow-sm md:gap-8 md:p-8 md:shadow-inner md:rounded-3xl md:bg-[rgba(0,0,0,0.4)]
            md:backdrop-blur-[4px]"
        >
          <div className="w-full text-3xl font-bold md:text-white">
            Web3 代码示例
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {examples.map(({ name, description, url, technologyStack }) => {
              return (
                <div
                  key={name}
                  className="flex flex-col gap-2 md:gap-4 p-2 transition-all duration-200 ease-in-out bg-white md:border-white rounded-md md:bg-inherit md:p-4 hover:border
              text-[#24292f] md:text-white border-gray-300 border md:border-0"
                >
                  <div className="flex justify-between">
                    <Link className="text-2xl" href={url}>
                      {name}
                    </Link>
                  </div>

                  <div className="text-sm text-[#57606a] md:text-inherit">
                    {description}
                  </div>

                  <div className="text-sm font-bold">技术栈</div>
                  <ul>
                    {technologyStack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </SimpleBar>
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg
      height="32"
      aria-hidden="true"
      viewBox="0 0 16 16"
      version="1.1"
      width="32"
      data-view-component="true"
    >
      <path
        fillRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      ></path>
    </svg>
  );
}
