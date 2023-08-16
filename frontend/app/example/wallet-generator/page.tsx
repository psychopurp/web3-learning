"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { useCopyToClipboard } from "usehooks-ts";
import { Accordion, AccordionItem, Input, Button } from "@nextui-org/react";

export default function Page() {
  const [generateNum, setGenerateNum] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<ethers.HDNodeWallet[]>([]);
  const [value, copy] = useCopyToClipboard();

  const generate = () => {
    const _wallets: ethers.HDNodeWallet[] = [];
    setIsLoading(true);
    setTimeout(() => {
      for (let i = 0; i < generateNum; i++) {
        const wallet = ethers.Wallet.createRandom();
        _wallets.push(wallet);
      }
      setWallets(_wallets);
      setIsLoading(false);
    }, 300);
  };

  const exports = () => {
    const book = utils.book_new();
    const data = wallets.map((wallet) => {
      return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        phrase: wallet.mnemonic?.phrase,
      };
    });

    const sheet = utils.json_to_sheet(data);
    sheet["!cols"] = [
      {
        wch: 50,
      },
      {
        wch: 140,
      },
      {
        wch: 70,
      },
      {
        wch: 80,
      },
    ];
    utils.book_append_sheet(book, sheet);
    writeFile(book, "addresses.xlsx");
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="text-4xl font-bold">Wallet Address Generator</div>
      <div className="font-bold">generate quantity</div>
      <div className="rounded-lg bg-cyan-300 p-4">
        Generate a maximum of 100 wallet addresses at a time, if too many will
        cause the browser to jam.
      </div>
      <Input
        type="number"
        max={100}
        variant="faded"
        onChange={(e) => {
          setGenerateNum(Number(e.target.value));
        }}
        placeholder="Please enter the generated quantity"
      />

      <Button
        onClick={generate}
        color="primary"
        variant="solid"
        disabled={isLoading}
        isLoading={isLoading}
      >
        Start to generate
      </Button>

      {wallets.length > 0 && <Button onClick={exports}>Batch export</Button>}

      <div className="flex flex-col gap-2">
        <Accordion>
          {wallets.map((wallet) => {
            return (
              <AccordionItem
                key={wallet.privateKey}
                className="flex flex-col gap-2"
                title={<h1 className="text-lg font-bold">{wallet.address}</h1>}
              >
                {/* <AccordionButton>
                  <Heading size="md">{wallet.address}</Heading>
                </AccordionButton> */}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="w-20">Address</p>
                    <Input
                      className="flex-1"
                      variant="bordered"
                      value={wallet.address}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        copy(wallet.address);
                      }}
                    >
                      {value === wallet.address ? "copied" : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Public key</p>
                    <Input
                      className="flex-1"
                      variant="bordered"
                      value={wallet.publicKey}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        copy(wallet.publicKey);
                      }}
                    >
                      {value === wallet.publicKey ? "copied" : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Private key</p>
                    <Input
                      className="flex-1"
                      variant="bordered"
                      value={wallet.privateKey}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        copy(wallet.privateKey);
                      }}
                    >
                      {value === wallet.privateKey ? "copied" : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Mnemonic words</p>
                    <Input
                      className="flex-1"
                      variant="bordered"
                      value={wallet.mnemonic?.phrase}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        copy(wallet.mnemonic?.phrase);
                      }}
                    >
                      {value === wallet.mnemonic?.phrase ? "copied" : "copy"}
                    </Button>
                  </div>
                </div>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
