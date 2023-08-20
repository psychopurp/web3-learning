import { NoahTokenABI } from "@/abi/NoahTokenABI";
import { Contract } from "@/abi/contract-address.json";
import { Spinner, Input, Button } from "@nextui-org/react";
import { useState } from "react";
import {
  useContractEvent,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { useToast } from "@chakra-ui/react";

const contract = {
  address: Contract as `0x${string}`,
  abi: NoahTokenABI.abi,
};

export function Component() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <Detail />
      <BalanceOf />
      <Transfer />
      <Allowance />
      <Approve />
      <TransferFrom />
    </div>
  );
}

function Detail() {
  const { data, isLoading, isError, error } = useContractReads({
    contracts: [
      { ...contract, functionName: "name" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "totalSupply" },
    ],
  });

  const [name, symbol, decimals, totalSupply] = data || [];

  return (
    <div>
      <div className="text-4xl font-medium">Token Info</div>
      {isError && (
        <div className="rounded-lg bg-cyan-300 p-4">{`Query failed, reason: ${error}`}</div>
      )}

      {isLoading && <Spinner />}

      {!isError && !isLoading && (
        <div>
          <div>Token Name: {name?.result?.toString()}</div>
          <div>Token Symbol: {symbol?.result?.toString()}</div>
          <div>Token Decimals: {decimals?.result?.toString()}</div>
          <div>Token Total Supply: {totalSupply?.result?.toString()}</div>
        </div>
      )}
    </div>
  );
}

function BalanceOf() {
  const [address, setAddress] = useState<string>("");
  const {
    data: balance,
    error,
    isError,
    isLoading,
    refetch,
  } = useContractRead({
    ...contract,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    enabled: address !== "",
  });

  useContractEvent({
    ...contract,
    eventName: "Transfer",
    listener: (logs) => {
      logs.forEach((log) => {
        if (!isError && (log.args.from == address || log.args.to == address)) {
          refetch();
        }
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-medium">Query Token Balance</div>
      <Input
        className="pt-2"
        placeholder="Enter the wallet address to automatically query the token balance."
        value={address}
        variant="bordered"
        onValueChange={(v) => setAddress(v)}
      />

      {isLoading ? <Spinner /> : <div>{balance?.toString()}</div>}

      {address !== "" && isError && (
        <div className="rounded-lg bg-red-300 p-2 mt-4">{`Query failed, reason: ${error}`}</div>
      )}
    </div>
  );
}

function Transfer() {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "transfer",
    args: [address as `0x${string}`, amount as unknown as bigint],
    enabled: address !== "" && amount > 0,
  });

  const {
    data,
    isLoading: isWriteLoading,
    write,
    isError: isWriteError,
  } = useContractWrite(config);

  const {
    error: transactionError,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-medium">Transfer</div>

      <Input
        placeholder="Enter the address of the wallet to be transferred"
        value={address}
        variant="bordered"
        onValueChange={(v) => setAddress(v)}
      />

      <Input
        placeholder="Enter the number of tokens to transfer"
        type="number"
        value={amount.toString()}
        variant="bordered"
        onValueChange={(v) => setAmount(v as unknown as number)}
      />

      <Button
        color="primary"
        disabled={!write || isWriteLoading || isTransactionLoading}
        onClick={() => {
          write?.();
        }}
      >
        Transfer
      </Button>

      {isWriteError ||
        (isTransactionError && (
          <div className="rounded-lg bg-red-300 p-2 mt-4">{`Transfer failed, reason: ${transactionError}`}</div>
        ))}
    </div>
  );
}

function Allowance() {
  const [owner, setOwner] = useState<string>("");
  const [spender, setSpender] = useState<string>("");

  const { data, error, refetch, isError, isLoading } = useContractRead({
    ...contract,
    functionName: "allowance",
    args: [owner as `0x${string}`, spender as `0x${string}`],
    enabled: owner !== "" && spender !== "",
  });

  useContractEvent({
    ...contract,
    eventName: "Approval",
    listener: (logs) => {
      logs.forEach((log) => {
        console.log(log);
        if (
          !isError &&
          (log.args.owner == owner || log.args.spender == owner)
        ) {
          refetch();
        }
      });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-medium">
        Query token authorization balance
      </div>

      <Input
        placeholder="Enter the address of the owner"
        value={owner}
        variant="bordered"
        onValueChange={(v) => setOwner(v)}
      />

      <Input
        placeholder="Enter the address of the spender"
        value={spender}
        variant="bordered"
        onValueChange={(v) => setSpender(v)}
      />

      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {data
            ? data.toString()
            : "Enter the address to automatically display the authorized balance"}
        </div>
      )}

      {owner !== "" && spender !== "" && isError && (
        <div className="rounded-lg bg-red-300 p-2 mt-4">{`The query failed for the reason: ${error}`}</div>
      )}
    </div>
  );
}

function Approve() {
  const [address, setAddress] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "approve",
    args: [address as `0x${string}`, amount as unknown as bigint],
    enabled: address !== "" && amount !== 0,
  });

  const {
    data,
    write,
    error: writeError,
    isError: isWriteError,
  } = useContractWrite(config);

  const {
    error: transactionError,
    isError: isTransactionError,
    isLoading: isTransactionLoading,
    isSuccess,
    isFetched,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const toast = useToast();
  if (isFetched && isSuccess) {
    toast({
      title: "Authorization Succeeded",
      description: `transaction hash: ${data?.hash}`,
      status: "success",
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-medium">Authorize</div>

      <Input
        placeholder="Enter the address of the wallet to be authorized"
        value={address}
        variant="bordered"
        onValueChange={(v) => setAddress(v)}
      />

      <Input
        placeholder="Enter the number of tokens to be authorized"
        type="number"
        value={amount.toString()}
        variant="bordered"
        onValueChange={(v) => setAmount(v as unknown as number)}
      />

      <Button
        color="primary"
        disabled={!write || isTransactionLoading}
        onClick={() => {
          write?.();
        }}
      >
        Authorize
      </Button>

      {isWriteError ||
        (isTransactionError && (
          <div className="rounded-lg bg-red-300 p-2 mt-4">{`Authorization failed, reason: ${
            writeError || transactionError
          }`}</div>
        ))}
    </div>
  );
}

function TransferFrom() {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const { config } = usePrepareContractWrite({
    ...contract,
    functionName: "transferFrom",
    args: [
      from as `0x${string}`,
      to as `0x${string}`,
      amount as unknown as bigint,
    ],
    enabled: from !== "" && to !== "" && amount !== 0,
  });

  const {
    data,
    write,
    error: writeError,
    isError: isWriteError,
  } = useContractWrite(config);

  const {
    error: transactionError,
    isError: isTransactionError,
    isLoading,
    isSuccess,
  } = useWaitForTransaction({
    hash: data?.hash,
  });

  const toast = useToast();

  if (isSuccess) {
    toast({
      title: "Success",
      description: `transaction hash: ${data?.hash}`,
      status: "success",
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-4xl font-medium">Transfer by authorization</div>
      <Input
        placeholder="Enter authorized address."
        value={from}
        variant="bordered"
        onValueChange={(v) => setFrom(v)}
      />
      <Input
        placeholder="Enter the address for the transfer."
        value={to}
        variant="bordered"
        onValueChange={(v) => setTo(v)}
      />
      <Input
        placeholder="Enter the number of tokens"
        type="number"
        value={amount.toString()}
        variant="bordered"
        onValueChange={(v) => setAmount(v as unknown as number)}
      />

      <Button
        color="primary"
        disabled={!write || isLoading}
        onClick={() => {
          write?.();
        }}
      >
        Transfer
      </Button>

      {isWriteError ||
        (isTransactionError && (
          <div className="rounded-lg bg-red-300 p-2 mt-4">{`Transfer failed, reason: ${
            writeError || transactionError
          }`}</div>
        ))}
    </div>
  );
}
