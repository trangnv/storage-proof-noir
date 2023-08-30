# Storage Proof with Noir

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
Deployed to: 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A
Transaction hash: 0x41e695fe252a76ea0b215da3379da7066630f99f2dc4b554a41d96565d012a9c
```

```bash
erc20-token git:(erc20) ✗ cast index address 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D 0
0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae
# Compute the storage slot for an entry in a mapping $ cast index key_type key slot
# We are looking at slot number 0 - _balances, key_type is address and key is the address 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D
```

```bash
cast storage 0x0041ff33E47eAE38ab8B9A1C2070E279d5AAf211 0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae --rpc-url $SEPOLIA_RPC_URL
0x00000000000000000000000000000000000000000000e8ef1e96ae3897800000 # 1_100_000 e18
$ cast proof 0x0041ff33E47eAE38ab8B9A1C2070E279d5AAf211 0x198faee1dd5108d4ea2f67cf2ffd891b1e4e7cfe8a157beebd36983e882a0dae --rpc-url $SEPOLIA_RPC_URL
```

## circuits

Circuit to prove: The value in the storage slot belong to the storage root

The depth of the storage trie depends on the number of owners (for this particular [Hodor NFT contract](https://goerli.etherscan.io/address/0xbefa2a0e4d815c6dcd8b93bf1668a422c1397c8a)), so 2 seperated circuits were created:

- `depth2`: circuit for depth 2 storage trie, 1 test should pass and 1 test should fail, the fail one is for the case when NFT is not minted yet (`eth_getProof` at a particular block)

- `depth3`: the only test should pass as input are from latest block (\_owner[1] has value other than 0x0)

- The values in test are processed with `eth_getProof` returned values, utils are in `ts/utils/storageProofPreprocessing`

## ts - testing noir circuits and Ethereum API endpoints utils

- Utility to get data from Alchemy API and process it to be used as input for Noir circuits

- Testing Noir circuits with TypeScript _(in progress)_
