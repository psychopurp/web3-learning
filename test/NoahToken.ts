import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Token contract", function () {
  // We define a fixture to reuse the same setup in every test. We use
  // loadFixture to run this setup once, snapshot that state, and reset Hardhat
  // Network to that snapshot in every test.
  async function deployTokenFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    // To deploy our contract, we just have to call ethers.deployContract and await
    // its waitForDeployment() method, which happens once its transaction has been
    // mined.
    const noah = await ethers.deployContract("NoahToken", [
      "noah",
      "NOAH",
      "1024",
    ]);

    await noah.waitForDeployment();

    // alternate way to deploy contract
    // const noahFactory = await ethers.getContractFactory("NoahToken");
    // const noah = await noahFactory.deploy("noah", "NOAH", "1024");

    // Fixtures can return anything you consider useful for your tests
    return { noah, owner, addr1, addr2 };
  }

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define each
    // of your tests. It receives the test name, and a callback function.
    //
    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { noah, owner } = await loadFixture(deployTokenFixture);

      // `expect` receives a value and wraps it in an assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await noah.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const { noah, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await noah.balanceOf(owner.address);
      expect(await noah.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const { noah, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );
      // Transfer 50 tokens from owner to addr1
      await expect(noah.transfer(addr1.address, 50)).to.changeTokenBalances(
        noah,
        [owner, addr1],
        [-50, 50]
      );

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(
        noah.connect(addr1).transfer(addr2.address, 50)
      ).to.changeTokenBalances(noah, [addr1, addr2], [-50, 50]);
    });

    it("Should emit Transfer events", async function () {
      const { noah, owner, addr1, addr2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to addr1
      await expect(noah.transfer(addr1.address, 50))
        .to.emit(noah, "Transfer")
        .withArgs(owner.address, addr1.address, 50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await expect(noah.connect(addr1).transfer(addr2.address, 50))
        .to.emit(noah, "Transfer")
        .withArgs(addr1.address, addr2.address, 50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const { noah, owner, addr1 } = await loadFixture(deployTokenFixture);
      const initialOwnerBalance = await noah.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(noah.connect(addr1).transfer(owner.address, 2))
        .to.be.revertedWithCustomError(noah, "ERC20InsufficientBalance")
        .withArgs(addr1.address, await noah.balanceOf(addr1.address), 2);

      // Owner balance shouldn't have changed.
      expect(await noah.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});
