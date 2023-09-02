// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import {Script} from "forge-std/Script.sol";
import {UltraVerifier} from "../src/plonk_vk.sol";
import {WhaleVerifier} from "../src/WhaleVerifier.sol";

contract DeployWhaleVerifier is Script {
    function run() external returns (WhaleVerifier) {
        // uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast();

        UltraVerifier ultraVerifier = new UltraVerifier();
        WhaleVerifier whaleVerifier = new WhaleVerifier(ultraVerifier);

        vm.stopBroadcast();

        return whaleVerifier;
    }
}