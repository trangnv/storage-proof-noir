// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "./plonk_vk.sol";

contract WhaleVerifier {
    UltraVerifier public verifier;
    mapping(bytes32 => bool) public usedHashes;

    constructor(UltraVerifier _verifier) {
        verifier = _verifier;
    }

    function verifyProof(bytes calldata proof, bytes32[] calldata pub_key_hash) public returns (bool) {
        bool proofResult = verifier.verify(proof, pub_key_hash);
        require(proofResult, "Proof is not valid");
        require(!usedHashes[pub_key_hash[0]], "Hash already used");
        usedHashes[pub_key_hash[0]] = true;
        return proofResult;
    }
}