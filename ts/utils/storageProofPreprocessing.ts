import "dotenv/config";
import { Network, Alchemy } from "alchemy-sdk";
import TOML from "@iarna/toml";
import fs from "fs";

type Serial = {
  proof: number[];
  key: number[];
  value: number[];
  storage: number[];
};

function serialise(val: string, pad: boolean = false) {
  let x = val.replace("0x", "");
  if (pad) {
    x = x.padStart(64, "0");
  }
  return Array.from(Buffer.from(x, "hex"));
}
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

// Setup: npm install alchemy-sdk
// Github: https://github.com/alchemyplatform/alchemy-sdk-js
export async function preprocessing(
  contract_address: String,
  storage_slot: Array<String>,
  block: String
) {
  // ): Promise<Serial> {
  // Optional config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
  };
  const alchemy = new Alchemy(settings);

  // Data to get the first owner of cryptopunk #1
  const res = await alchemy.core.send("eth_getProof", [
    contract_address,
    storage_slot,
    block,
  ]);

  const MAX_TRIE_NODE_LENGTH = 532;
  const { storageProof, storageHash } = res;
  const theProof = storageProof[0];

  let proofPath: string = "";
  for (let i = 0; i < theProof.proof.length; i++) {
    let layer = theProof.proof[i];
    layer = layer.replace("0x", "").padEnd(MAX_TRIE_NODE_LENGTH * 2, "0");
    proofPath = proofPath + layer;
  }

  // encode this into bytes which can be interpreted by the prover
  // The rlp encoded proof path is right padded at each node with 0s and then concatenated
  const key = serialise(theProof.key);
  const value = serialise(theProof.value, true);
  const proof = serialise(proofPath);
  const storage = serialise(storageHash);

  console.log("theValue: ", theProof.value);

  const proofData: Serial = {
    proof,
    key,
    storage,
    value,
  };

  // const proofAsToml = TOML.stringify(proofData);
  // fs.writeFileSync("Prover.toml", proofAsToml);
  return proofData;
}
