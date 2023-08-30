# Storage Proof with Noir

Prove that you own an address that has more than 1_000_000 [NOIR](https://sepolia.etherscan.io/address/0x0041ff33e47eae38ab8b9a1c2070e279d5aaf211) ERC20 tokens without revealing the address.

[erc721 branch](https://github.com/trangnv/storage-proof-noir/tree/erc721) has the same goal but with an ERC721 token.

```bash
.
├── README.MD
├── circuits
├── docs
├── erc20-token # example NFT contract
├── hodor
└── ts # testing noir circuits and Ethereum API endpoints utils
```

## Contracts and storage layout

### ERC20Contract storage layout

```bash
$ cd erc20-token
forge inspect src/Noir.sol:Noir storage --pretty
| Name         | Type                                            | Slot | Offset | Bytes | Contract          |
|--------------|-------------------------------------------------|------|--------|-------|-------------------|
| _balances    | mapping(address => uint256)                     | 0    | 0      | 32    | src/Noir.sol:Noir |
| _allowances  | mapping(address => mapping(address => uint256)) | 1    | 0      | 32    | src/Noir.sol:Noir |
| _totalSupply | uint256                                         | 2    | 0      | 32    | src/Noir.sol:Noir |
| _name        | string                                          | 3    | 0      | 32    | src/Noir.sol:Noir |
| _symbol      | string                                          | 4    | 0      | 32    | src/Noir.sol:Noir |
| _owner       | address                                         | 5    | 0      | 20    | src/Noir.sol:Noir |
```

### Read contract storage, on Sepolia

```bash
$ forge create Noir --private-key $PRIVATE_KEY --verify --rpc-url $SEPOLIA_RPC_URL
Deployer: 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D
Deployed to: 0x0041ff33E47eAE38ab8B9A1C2070E279d5AAf211
```

```bash
$ cast index address 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D 0
0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae
# Compute the storage slot for an entry in a mapping $ cast index key_type key slot
# We are looking at slot number 0 - _balances, key_type is address and key is the address 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D
```

```bash
$ cast storage 0x0041ff33E47eAE38ab8B9A1C2070E279d5AAf211 0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae --rpc-url $SEPOLIA_RPC_URL
0x00000000000000000000000000000000000000000000e8ef1e96ae3897800000 # 1_100_000 e18
$ cast proof 0x0041ff33E47eAE38ab8B9A1C2070E279d5AAf211 0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae --rpc-url $SEPOLIA_RPC_URL
```

## Circuits

## What to prove:

- I am the owner of an address
- That address has more than 1_000_000 [NOIR](https://sepolia.etherscan.io/address/0x0041ff33e47eae38ab8b9a1c2070e279d5aaf211) ERC20 tokens so I am NOIR whale
- And I'm not revealing my address

## How?

- Sign a message with my private key
- Use [ecrecover](https://github.com/colinnielsen/ecrecover-noir) to get my address in the circuit
- Calculate the key slot corresponding to the address and the \_balances mapping
- Use [noir-trie-proofs](https://github.com/aragonzkresearch/noir-trie-proofs) to prove the storage value belongs to the storage root
- Compare the value with 1_000_000

## ts - testing noir circuits and Ethereum API endpoints utils

- Utility to sign message with private key, get data from Alchemy API and process it to be used as input for Noir circuits

- Testing Noir circuits with TypeScript _(in progress)_

# References

- [noir-storage-proofs-demo](https://github.com/Maddiaa0/noir-storage-proofs-demo)
- [noir-trie-proofs](https://github.com/aragonzkresearch/noir-trie-proofs)
