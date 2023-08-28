# Storage Proof with Noir

```bash
.
├── README.MD
├── circuits
└── hodor # example NFT contract
```

## Example contract and its storage layout

### Contract storage layout

```bash
$ cd hodor
$ forge inspect src/Hodor.sol:Hodor storage --pretty
| Name               | Type                                         | Slot | Offset | Bytes | Contract            |
|--------------------|----------------------------------------------|------|--------|-------|---------------------|
| _name              | string                                       | 0    | 0      | 32    | src/Hodor.sol:Hodor |
| _symbol            | string                                       | 1    | 0      | 32    | src/Hodor.sol:Hodor |
| _owners            | mapping(uint256 => address)                  | 2    | 0      | 32    | src/Hodor.sol:Hodor |
| _balances          | mapping(address => uint256)                  | 3    | 0      | 32    | src/Hodor.sol:Hodor |
| _tokenApprovals    | mapping(uint256 => address)                  | 4    | 0      | 32    | src/Hodor.sol:Hodor |
| _operatorApprovals | mapping(address => mapping(address => bool)) | 5    | 0      | 32    | src/Hodor.sol:Hodor |
| _owner             | address                                      | 6    | 0      | 20    | src/Hodor.sol:Hodor |
| _tokenIdCounter    | struct Counters.Counter                      | 7    | 0      | 32    | src/Hodor.sol:Hodor |
```

### Read contract storage, on Goerli

```bash
$ forge create Hodor --private-key $PRIVATE_KEY --verify --rpc-url $RPC_URL
Deployer: 0x77fCF983241ceb7e8c928102f6fe63A1de834c5D
Deployed to: 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A
Transaction hash: 0x41e695fe252a76ea0b215da3379da7066630f99f2dc4b554a41d96565d012a9c
```

```bash
$ cast index uint256 0 2
0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b
# Compute the storage slot for an entry in a mapping $ cast index key_type key slot
# We are looking at slot number 2, key_type is uint256 and key is 0
```

```bash
$ cast storage 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A 0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b --rpc-url $RPC_URL
0x00000000000000000000000077fcf983241ceb7e8c928102f6fe63a1de834c5d
cast proof 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A 0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b --rpc-url $RPC_URL
```
