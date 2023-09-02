import { NoirNode } from "../utils/noirNode.js";
const noir = new NoirNode();
import { test, beforeAll, describe, expect, assert } from "vitest";
import { preprocessing } from "../utils/storageProofPreprocessing.js";

// import ethers, { Contract } from "ethers";
// import path from "path";
// import { execSync } from "child_process";
// import { decompressSync } from "fflate";
// import {
//   Crs,
//   newBarretenbergApiAsync,
//   RawBuffer,
// } from "@aztec/bb.js/dest/node/index.js";
// import { executeCircuit, compressWitness } from "@noir-lang/acvm_js";

import circuit from "../../circuits/whale/target/sp.json" assert { type: "json" };
import { generate } from "../utils/populateInput.js";
import { defineConfig } from "vite";

describe("Test noir circuits", () => {
  const acirBuffer = Buffer.from(circuit.bytecode, "base64");
  console.log("acirBuffer: ", acirBuffer);
  beforeAll(async () => {
    await noir.init();
    console.log("noir init!");
  });
  test("Should generate witness", async () => {
    // const input = { x: 3, y: 4, z: 12 };
    // const input = await generate();
    // await noir.generateWitness(input, acirBuffer);
    console.log("witness generated!");
  });
  // test("Should not generate witness", async () => {
  //   // const input = { x: 3, y: 4, z: 13 };
  //   const input = await prepro(
  //     "0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A",
  //     ["0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0"],
  //     "latest"
  //   );
  // console.log(input);
  // try {
  //   await noir.generateWitness(input, acirBuffer);
  // } catch (err: any) {
  //   console.log(err);
  //   //   assert(err.message.includes("could not satisfy all constraints""));
  // }
  // });
});
