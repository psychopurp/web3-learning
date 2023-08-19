import { artifacts, ethers } from "hardhat";
import path from "path";
import fs from "fs";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const ContractFactory = await ethers.getContractFactory("NoahToken");
  const contract = await ContractFactory.deploy(
    "elo",
    "ELO",
    "1024000000000000000000"
  );

  console.log("Contract address:", await contract.getAddress());

  saveFrontendFiles("NoahToken", await contract.getAddress());
}

function saveFrontendFiles(contractName: string, address: string) {
  const abiDir = path.join(__dirname, "..", "frontend", "abi");

  if (!fs.existsSync(abiDir)) {
    fs.mkdirSync(abiDir);
  }

  fs.writeFileSync(
    path.join(abiDir, "contract-address.json"),
    JSON.stringify({ Contract: address }, undefined, 2)
  );

  const Artifact = artifacts.readArtifactSync(contractName);

  const abiTs = `export const ${contractName}ABI = ${JSON.stringify(
    Artifact,
    null,
    2
  )} as const`;

  fs.writeFileSync(path.join(abiDir, `${contractName}ABI.ts`), abiTs);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
