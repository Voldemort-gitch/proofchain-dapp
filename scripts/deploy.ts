import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Deploying ProofChain contract...");

  const ProofChain = await ethers.getContractFactory("ProofChain");
  const proofChain = await ProofChain.deploy();

  await proofChain.waitForDeployment();

  const address = await proofChain.getAddress();
  console.log(`ProofChain deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
