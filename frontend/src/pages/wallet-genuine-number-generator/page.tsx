"use client";

import { ethers } from "ethers";
import { useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { Accordion, AccordionItem, Input, Button } from "@nextui-org/react";

export function Component() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<ethers.HDNodeWallet[]>([]);
  const [value, copy] = useCopyToClipboard();

  const [startChar, setStartChar] = useState<string>("");
  const [includeChar, setIncludeChar] = useState<string>("");
  const [endChar, setEndChar] = useState<string>("");

  const generate = () => {
    let _wallet: ethers.HDNodeWallet | null = null;
    setIsLoading(true);
    setWallets([]);
    setTimeout(() => {
      const match = new RegExp(`^0x${startChar}.*${includeChar}.*${endChar}$`);

      while (true) {
        const wallet = ethers.Wallet.createRandom();
        if (match.test(wallet.address)) {
          _wallet = wallet;
          break;
        }
      }

      setWallets([_wallet]);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="text-4xl font-bold">Vanity Wallet Address Generator</div>
      <div className="rounded-lg bg-cyan-300 p-4">
        The harsher the conditions, the slower the generation speed.
      </div>

      <div className="font-bold">Enter the starting numbers</div>
      <Input
        type="number"
        value={startChar}
        onChange={(e) => {
          setStartChar(e.target.value);
        }}
        placeholder="Please enter the starting numbers"
      />

      <div className="font-bold">Enter the containing numbers</div>
      <Input
        type="number"
        value={includeChar}
        max={100}
        onChange={(e) => {
          setIncludeChar(e.target.value);
        }}
        placeholder="Please enter the containing numbers"
      />

      <div className="font-bold">Enter the ending numbers</div>
      <Input
        type="number"
        value={endChar}
        max={100}
        onChange={(e) => {
          setEndChar(e.target.value);
        }}
        placeholder="Please enter the ending numbers"
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

      <div className="flex flex-col gap-2">
        <Accordion>
          {wallets.map((wallet) => {
            return (
              <AccordionItem
                key={wallet.privateKey}
                className="flex flex-col gap-2"
                title={<h1 className="text-lg font-bold">{wallet.address}</h1>}
              >
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
