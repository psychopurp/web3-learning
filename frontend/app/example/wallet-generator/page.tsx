"use client";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Alert,
  Button,
  Heading,
  Input,
  useClipboard,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import { utils, writeFile } from "xlsx";

export default function Page() {
  const [generateNum, setGenerateNum] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<ethers.HDNodeWallet[]>([]);
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

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
      <Heading>Wallet address generator</Heading>
      <Heading size={"sm"}>generate quantity</Heading>
      <Alert>
        Generate a maximum of 100 wallet addresses at a time, if too many will
        cause the browser to jam.
      </Alert>
      <Input
        type="number"
        value={generateNum}
        max={100}
        errorBorderColor="red.300"
        onChange={(e) => {
          setGenerateNum(Number(e.target.value));
        }}
        placeholder="Please enter the generated quantity"
      />

      <Button
        onClick={generate}
        bgColor="blue.400"
        disabled={isLoading}
        isLoading={isLoading}
      >
        start generating
      </Button>

      {wallets.length > 0 && <Button onClick={exports}>Batch export</Button>}

      <div className="flex flex-col gap-2">
        <Accordion allowToggle>
          {wallets.map((wallet) => {
            return (
              <AccordionItem
                key={wallet.privateKey}
                className="flex flex-col gap-2"
              >
                <AccordionButton>
                  <Heading size="md">{wallet.address}</Heading>
                </AccordionButton>

                <AccordionPanel className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <p className="w-20">Address</p>
                    <Input className="flex-1" value={wallet.address} readOnly />
                    <Button
                      onClick={() => {
                        setValue(wallet.address);
                        onCopy();
                      }}
                    >
                      {hasCopied && value === wallet.address
                        ? "copied"
                        : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Public key</p>
                    <Input
                      className="flex-1"
                      value={wallet.publicKey}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        setValue(wallet.publicKey);
                        onCopy();
                      }}
                    >
                      {hasCopied && value === wallet.publicKey
                        ? "copied"
                        : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Private key</p>
                    <Input
                      className="flex-1"
                      value={wallet.privateKey}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        setValue(wallet.privateKey);
                        onCopy();
                      }}
                    >
                      {hasCopied && value === wallet.privateKey
                        ? "copied"
                        : "copy"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="w-20">Mnemonic words</p>
                    <Input
                      className="flex-1"
                      value={wallet.mnemonic?.phrase}
                      readOnly
                    />
                    <Button
                      onClick={() => {
                        setValue(wallet.mnemonic?.phrase);
                        onCopy();
                      }}
                    >
                      {hasCopied && value === wallet.mnemonic?.phrase
                        ? "copied"
                        : "copy"}
                    </Button>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
