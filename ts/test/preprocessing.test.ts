import { NoirNode } from "../utils/noirNode.js";
const noir = new NoirNode();
import { test, beforeAll, describe, expect, assert } from "vitest";
import { preprocessing } from "../utils/storageProofPreprocessing.js";

// import circuit from "../../circuits/depth3_storage_proof/target/main.json" assert { type: "json" };

describe("Test get_ethProof and generate prover input", () => {
  test("Should process prover input", async () => {
    const input = await preprocessing(
      "0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A",
      // ["0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b"], // owner of Hodor #0 storage slot
      ["0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0"], // owner of Hodor #1
      // [
      //   "0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b",
      //   "0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0",
      // ],
      // "latest"
      "0x60263ae988a27f28d44c96e292b8a0d6cbdc9473f0ed70f46f77550bbf6271eb" // block 9590306 which Hodors #1 were NOT minted
    );
    // console.log("input: ", input);
  });
});
