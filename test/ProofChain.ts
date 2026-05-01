import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;

describe("ProofChain", function () {
  async function deployProofChainFixture() {
    const ProofChain = await ethers.getContractFactory("ProofChain");
    const proofChain = await ProofChain.deploy();
    return { proofChain };
  }

  it("Should return false for a non-existent certificate", async function () {
    const { proofChain } = await deployProofChainFixture();
    const fakeHash = ethers.id("fake_certificate_data");
    expect(await proofChain.verifyCert(fakeHash)).to.equal(false);
  });

  it("Should add a certificate hash and emit an event", async function () {
    const { proofChain } = await deployProofChainFixture();
    const certHash = ethers.id("student:JohnDoe|course:CS101|issuer:UniversityX");

    await expect(proofChain.addCert(certHash))
      .to.emit(proofChain, "CertificateAdded")
      .withArgs(certHash);
  });

  it("Should return true for an added certificate", async function () {
    const { proofChain } = await deployProofChainFixture();
    const certHash = ethers.id("student:JaneDoe|course:Math202|issuer:UniversityY");

    await proofChain.addCert(certHash);
    expect(await proofChain.verifyCert(certHash)).to.equal(true);
  });

  it("Should revert if trying to add the same certificate twice", async function () {
    const { proofChain } = await deployProofChainFixture();
    const certHash = ethers.id("student:Bob|course:History|issuer:SchoolZ");

    await proofChain.addCert(certHash);
    await expect(proofChain.addCert(certHash)).to.be.revertedWith(
      "Certificate already exists"
    );
  });
});
