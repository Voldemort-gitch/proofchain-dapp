// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ProofChain v2.0
 * @dev Added Authority Control (OnlyOwner) to secure the issuance process.
 */
contract ProofChain {
    address public owner;
    mapping(bytes32 => bool) private certificates;

    event CertificateAdded(bytes32 indexed certHash);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the authorized issuer");
        _;
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /**
     * @dev Add a new certificate hash. Only the authorized owner can do this.
     * @param certHash The keccak256 hash of the certificate data.
     */
    function addCert(bytes32 certHash) public onlyOwner {
        require(!certificates[certHash], "Certificate already exists");
        certificates[certHash] = true;
        emit CertificateAdded(certHash);
    }

    /**
     * @dev Verify if a certificate hash exists on the blockchain.
     * @param certHash The keccak256 hash to verify.
     * @return bool True if the certificate is authentic.
     */
    function verifyCert(bytes32 certHash) public view returns (bool) {
        return certificates[certHash];
    }

    /**
     * @dev Transfer ownership to a new address.
     * @param newOwner The address of the new authority.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
