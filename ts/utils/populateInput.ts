// import { NoirNode } from "./NoirNode";
// import { dotenv } from "dotenv";
import "dotenv/config";
import { convertToHex, writeToToml } from "./helper.js";
import { fileURLToPath } from "url";
import { resolve, dirname } from "path";
import { ethers } from "ethers";
import { preprocessing } from "./storageProofPreprocessing.js";
// @ts-ignore -- no types
// import blake2 from "blake2";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY!;

export async function main() {
  const user = new ethers.Wallet(PRIVATE_KEY);
  console.log("user address: ", user.address);

  const pubKey = Array.from(
    ethers.utils.arrayify(user.publicKey).slice(1).values()
  );

  let message = "this is a message";

  // sign the message
  let signature = Array.from(
    ethers.utils
      .arrayify(await user.signMessage(message))
      .slice(0, 64)
      .values()
  );

  let hashedMessage = ethers.utils.hashMessage(message);
  let hashed_message = Array.from(
    ethers.utils.arrayify(hashedMessage).values()
  );

  // const nullifierBuff = blake2
  //   .createHash("blake2s")
  //   .update(ethers.utils.arrayify(signature).slice(0, 64))
  //   .digest();

  // let nullifier = Array.from(nullifierBuff).map((elem) => Number(elem));

  const storage_proof = await preprocessing(
    "0x0041ff33e47eae38ab8b9a1c2070e279d5aaf211",
    ["0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae"], // owner of Hodor #1
    "latest" // block 9590306 which Hodors #1 were NOT minted
  );

  let data = {
    pub_key: pubKey,
    signature: signature,
    hashed_message: hashed_message,
    proof: storage_proof.proof,
    storage_slot_key: storage_proof.key,
    storage: storage_proof.storage,
    value: storage_proof.value,
    // nullifier,
  };

  const dir = dirname(fileURLToPath(import.meta.url));
  let path = resolve(dir + "../../../circuits/whale/Prover.toml");

  writeToToml(data, path);
}
// const provider = new ethers.providers.JsonRpcProvider(
//   "SEPOLIA_RPC_URL="
// );

export async function getStorageSlot() {
  const address =
    "0x77fCF983241ceb7e8c928102f6fe63A1de834c5D".toLocaleLowerCase();
  const slot = "0x0";
  const paddedAddress = ethers.utils.hexZeroPad(address, 32);
  const paddedSlot = ethers.utils.hexZeroPad(slot, 32);
  const concatenated = ethers.utils.concat([paddedAddress, paddedSlot]);
  const hash = ethers.utils.keccak256(concatenated);

  // const result = await provider.getStorageAt(
  //   "0xC216FdC8fb87A151d69313e18a80a58bebBA7267",
  //   hash
  // );
  // console.log("result ethers:", parseInt(result, 16));
}

main();
// getStorageSlot();
