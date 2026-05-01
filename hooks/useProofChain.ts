"use client";

import { 
  useWriteContract, 
  useReadContract, 
  useWaitForTransactionReceipt,
  useAccount
} from "wagmi";
import { PROOFCHAIN_ADDRESS, PROOFCHAIN_ABI } from "@/utils/contractInfo";
import { encodePacked, keccak256 } from "viem";

export function useProofChain() {
  const { address } = useAccount();
  const { data: hash, writeContract, isPending: isWritePending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  // Read the owner address from the contract
  const { data: ownerAddress } = useReadContract({
    address: PROOFCHAIN_ADDRESS,
    abi: PROOFCHAIN_ABI,
    functionName: "owner",
  });

  const isOwner = address && ownerAddress && address.toLowerCase() === ownerAddress.toLowerCase();

  const generateCertHash = (recipient: string, course: string, issuer: string) => {
    return keccak256(
      encodePacked(
        ["string", "string", "string"],
        [recipient, course, issuer]
      )
    );
  };

  const addCertificate = async (certHash: `0x${string}`) => {
    writeContract({
      address: PROOFCHAIN_ADDRESS,
      abi: PROOFCHAIN_ABI,
      functionName: "addCert",
      args: [certHash],
    });
  };

  const verifyCertificate = (certHash: `0x${string}`) => {
    return useReadContract({
      address: PROOFCHAIN_ADDRESS,
      abi: PROOFCHAIN_ABI,
      functionName: "verifyCert",
      args: [certHash],
    });
  };

  return {
    addCertificate,
    generateCertHash,
    verifyCertificate,
    isWritePending,
    isConfirming,
    isConfirmed,
    writeError,
    txHash: hash,
    isOwner,
    ownerAddress,
  };
}
