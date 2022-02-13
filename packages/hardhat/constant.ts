import { BigNumber, utils } from "ethers";
import { TypedDataField } from "@ethersproject/abstract-signer";

export function getTimestamp(date: Date): number {
  return BigNumber.from(date.valueOf()).div(1000).toNumber();
}

export type NFTVoucher = {
  redeemer: string;
  stageId: number;
  nonce: number;
  amount: number;
};

export type StageInfo = {
  stageId: number;
  maxSupply: number;
  startTime: number;
  endTime: number;
  mintPrice: BigNumber;
};

export const VOUCHER_TYPE: Record<string, TypedDataField[]> = {
  NFTVoucher: [
    { name: "redeemer", type: "address" },
    { name: "stageId", type: "uint8" },
    { name: "nonce", type: "uint8" },
    { name: "amount", type: "uint8" },
  ],
};

// Stage #1
// Type in your start time
export const STAGE_1_START = getTimestamp(new Date(2022, 1 - 1, 30, 22, 30));
export const STAGE_1_END = getTimestamp(new Date(2022, 2 - 1, 21, 1, 30));
export const STAGE_1_PRICE = utils.parseEther("0.07");
export const STAGE_1_SUPPLY = 100;
export const UNREVEALED_BASE_URI =
  "ipfs://QmSmy9woJEuEyA57o5cbVHYkF1RLibJfpQiJNqmfEtno6f/";

// Stage #2 (public)
export const STAGE_2_START = getTimestamp(new Date(2022, 2 - 1, 21, 1, 30));
export const STAGE_2_END = getTimestamp(new Date(2100, 3 - 1, 1));
export const STAGE_2_PRICE = utils.parseEther("0.1");
export const STAGE_2_SUPPLY = 100;

// Settle
export const FINAL_BASE_URI =
  "ipfs://QmQu2oEk2ZmeDFcoaJsCPSnFGPkoDUPWEyVhT6VRZSuxbz/"; // TODO

type AddressMap = { [chainId: string]: string };
export const CONTRACT_ADDRESS: AddressMap = {
  "1": "0x5FbDB2315678afecb367f032d93F642f64180aa3", // TODO
  "4": "0x4db9eC6c31Bc15271be56886e975fE3890Fe0a97", // TODO
  "1337": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
};
