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

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<ethers.HDNodeWallet[]>([]);
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

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
      <Heading>Vanity Wallet Address Generator</Heading>
      <Alert>
        The harsher the conditions, the slower the generation speed.
      </Alert>

      <Heading size={"sm"}>Enter the starting numbers</Heading>
      <Input
        type="number"
        value={startChar}
        onChange={(e) => {
          setStartChar(e.target.value);
        }}
        placeholder="Please enter the starting numbers"
      />

      <Heading size={"sm"}>Enter the containing numbers</Heading>
      <Input
        type="number"
        value={includeChar}
        max={100}
        onChange={(e) => {
          setIncludeChar(e.target.value);
        }}
        placeholder="Please enter the containing numbers"
      />

      <Heading size={"sm"}>Enter the ending numbers</Heading>
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
        bgColor="blue.400"
        disabled={isLoading}
        isLoading={isLoading}
      >
        Start to generate
      </Button>

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
