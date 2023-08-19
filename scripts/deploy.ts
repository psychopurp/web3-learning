import { ethers } from "hardhat";

async function main() {
  const NoahToken = await ethers.deployContract("NoahToken", [
    "noah",
    "NOAH",
    "1024000000000000000000",
  ]);

  await NoahToken.waitForDeployment();

  console.log(`NoahToken deployed to ${NoahToken}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
