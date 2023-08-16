"use client";
import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { Dialog, Transition } from "@headlessui/react";
import dynamic from "next/dynamic";
import Jazzicon from "react-jazzicon";
import { Button, Card, CardBody, Input } from "@nextui-org/react";

type IWalletCtx = {
  walletProvider: ethers.BrowserProvider;
  setWalletProvider: (walletProvider: ethers.BrowserProvider) => void;
  msgIsOpen: boolean;
  setMsgIsOpen: (msgIsOpen: boolean) => void;
  msg: string;
  setMsg: (msg: string) => void;
  account: string;
  setAccount: (account: string) => void;
  networkName: string;
  setNetworkName: (networkName: string) => void;
  balance: string;
  setBalance: (balance: string) => void;
  showMessage: (message: string) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
};

const WalletCtx = createContext<IWalletCtx>({} as IWalletCtx);

function PageWithNoSSR() {
  const [walletProvider, setWalletProvider] = useState<ethers.BrowserProvider>(
    {} as ethers.BrowserProvider
  );
  const [msgIsOpen, setMsgIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [account, setAccount] = useState<string>("");
  const [networkName, setNetworkName] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const showMessage = (message: string) => {
    setMsg(message);
    setMsgIsOpen(true);
    setTimeout(() => {
      setMsg("");
      setMsgIsOpen(false);
    }, 2000);
  };

  useEffect(() => {
    if (!window.ethereum) {
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    setWalletProvider(provider);
  }, []);

  if (!window?.ethereum) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-thin">
          Please install{" "}
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn">
            MetaMask
          </a>
        </h1>
      </div>
    );
  }

  return (
    <WalletCtx.Provider
      value={{
        walletProvider,
        setWalletProvider,
        msgIsOpen,
        setMsgIsOpen,
        msg,
        setMsg,
        account,
        setAccount,
        networkName,
        setNetworkName,
        balance,
        setBalance,
        showMessage,
        refresh,
        setRefresh,
      }}
    >
      <div className="flex flex-col gap-4 p-4">
        <Transition appear show={msgIsOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setMsgIsOpen(false)}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {msg}
                    </Dialog.Title>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Connect />
        <Details />
        <Transfer />
      </div>
    </WalletCtx.Provider>
  );
}

function Connect() {
  const {
    walletProvider,
    account,
    setAccount,
    setNetworkName,
    setBalance,
    showMessage,
    refresh,
  } = useContext(WalletCtx);

  const refreshBalance = useCallback(async () => {
    if (!walletProvider || !account) return;
    const balance = await walletProvider.getBalance(account);
    setBalance(ethers.formatEther(balance));
  }, [setBalance, walletProvider, account]);

  useEffect(() => {
    refreshBalance();
  }, [refresh, refreshBalance]);

  const connectToMetamask = async () => {
    try {
      const accounts = await walletProvider.send("eth_requestAccounts", []);
      const network = await walletProvider.getNetwork();
      const balance = await walletProvider.getBalance(accounts[0]);
      setAccount(accounts[0]);
      setNetworkName(network.name);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.log(error);
      showMessage(error.message);
    }
  };

  const disconnect = async () => {
    setAccount("");
  };

  if (!account) {
    return (
      <div className="flex justify-end p-4">
        {walletProvider ? (
          <Button color="primary" variant="shadow" onClick={connectToMetamask}>
            connect to metamask
          </Button>
        ) : (
          <Loading />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Jazzicon diameter={30} seed={parseInt(account.slice(2, 10), 16)} />
        <h1 className="text-end">
          Hello,{" "}
          {account.substring(0, 5) +
            "..." +
            account.substring(account.length - 4, account.length)}
        </h1>
      </div>

      <Button onClick={disconnect}>disconnect</Button>
    </div>
  );
}

function Details() {
  const { account, networkName, balance } = useContext(WalletCtx);
  if (!account) {
    return null;
  }
  return (
    <Card
      isBlurred
      className="text-white rounded-md flex flex-col w-full bg-slate-800"
      shadow="sm"
    >
      <CardBody>
        <div className="flex justify-between">
          <div className="text-2xl font-thin">balance</div>
          <div>network: {networkName}</div>
        </div>

        <div className="flex items-end gap-2">
          <div className="text-2xl">{balance.substring(0, 10)}</div>
          <div>ETH</div>
        </div>
      </CardBody>
    </Card>
  );
}

function Transfer() {
  const { walletProvider, account, showMessage, refresh, setRefresh } =
    useContext(WalletCtx);
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [transferring, setTransferring] = useState<boolean>(false);

  const transfer = async () => {
    try {
      const value = ethers.parseEther(amount);
      const signer = await walletProvider.getSigner();

      setTransferring(true);
      const tx = await signer.sendTransaction({
        to: to,
        value: value,
      });

      await tx.wait();

      setTo("");
      setAmount("");
      showMessage("successfully transferred");
    } catch (error) {
      console.log(error);
      showMessage(error.message);
    } finally {
      setTransferring(false);
      setRefresh(!refresh);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="text-4xl font-bold">Transfer</div>
      {transferring ? (
        <div className="flex flex-col items-center gap-4">
          <div className="text-3xl">transferring...</div>
          <Loading size="xl" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Input
            variant="bordered"
            value={to}
            onInput={(e: any) => setTo(e.target.value)}
            type="text"
            placeholder="address"
          />
          <Input
            variant="bordered"
            value={amount}
            onInput={(e: any) => setAmount(e.target.value)}
            type="number"
            placeholder="amount"
          />
          <Button color="primary" variant="shadow" onClick={transfer}>
            send
          </Button>
        </div>
      )}
    </div>
  );
}

function Loading({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "h-3 w-3",
    md: "h-5 w-5",
    lg: "h-7 w-7",
    xl: "h-9 w-9",
  };
  return (
    <svg
      className={`animate-spin -ml-1 mr-3 ${sizes[size]} text-black`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

const Page = dynamic(() => Promise.resolve(PageWithNoSSR), { ssr: false });

export default function Index() {
  return <Page></Page>;
}
