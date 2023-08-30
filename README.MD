# Storage Proof with Noir

```bash
.
├── README.MD
├── circuits
├── hodor # example NFT contract
└── ts # testing noir circuits and Ethereum API endpoints utils
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
# We are looking at slot number 2 - _owners, key_type is uint256 and key is 0
```

```bash
$ cast storage 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A 0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b --rpc-url $RPC_URL
0x00000000000000000000000077fcf983241ceb7e8c928102f6fe63a1de834c5d
$ cast proof 0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A 0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b --rpc-url $RPC_URL
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

```rust
fn test_main_fail() {
/* INPUTS:
  Contract address: "0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A",
  ["0xe90b7bceb6e7df5418fb78d8ee546e97c83a08bbccc01a0644d599ccd2a7c2e0"], // owner of Hodor #1 is stored at this slot
  "0x60263ae988a27f28d44c96e292b8a0d6cbdc9473f0ed70f46f77550bbf6271eb" // block 9590306 which Hodors #1 WEREN'T minted
*/

fn test_main_pass(){
/* INPUTS:
  Contract address: "0xbeFA2A0E4D815C6dcd8b93bf1668A422c1397C8A",
  ["0xac33ff75c19e70fe83507db0d683fd3465c996598dc972688b7ace676c89077b"], // owner of Hodor #0 is stored at this slot
  "0x60263ae988a27f28d44c96e292b8a0d6cbdc9473f0ed70f46f77550bbf6271eb" // block 9590306 which Hodors #0 WERE minted
*/
```
