// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import {Script, console} from "forge-std/Script.sol";
import {WhaleVerifier} from "../src/WhaleVerifier.sol";
import {Test, console} from "forge-std/Test.sol";
import {DeployWhaleVerifier} from "../script/DeployWhaleVerifier.s.sol";
// import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
// import {StdCheats} from "forge-std/StdCheats.sol";

contract TestVerifier is Test {
    WhaleVerifier public whaleVerifier;
    bytes public proofBytes;
    bytes32[] publicInputs = new bytes32[](1);
    address public constant USER = address(1);

    function setUp() external {
        DeployWhaleVerifier deployer = new DeployWhaleVerifier();
        whaleVerifier = deployer.run();

        string memory proof = vm.readLine("./data/p.proof");
        proofBytes = vm.parseBytes(proof);

        string memory json = vm.readFile("./data/public_inputs.json");
        bytes memory  publicValue = vm.parseJson(json, ".return");
        publicInputs[0] = bytes32(publicValue);
        // vm.deal(USER, 10000000000000);
    }

    function testVerifyPass() public {
        whaleVerifier.verifyProof(proofBytes, publicInputs);
    }
    function testDoubleProof() public {
        vm.expectRevert();
        whaleVerifier.verifyProof(proofBytes, publicInputs);
        whaleVerifier.verifyProof(proofBytes, publicInputs);
    }
}