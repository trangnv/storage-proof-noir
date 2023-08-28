use dep::proof;

global DEPTH: Field = 3;
global PROOF_LEN: Field = 1596;

fn main(
    proof: [u8; PROOF_LEN], 
    // The storage slot we would like to prove
    key: [u8;32], 
    // The storage root we would like to prove against
    storage: [u8; 32], 
    // The value in the storage slot
    value: [u8; 32]
) {
    let depth = DEPTH;
    let trie_proof = proof::TrieProof {
        key,
        proof,
        depth,
        value
    };
    assert(trie_proof.verify_storage_root(storage));
}
