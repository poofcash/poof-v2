require('dotenv').config()

const MerkleTree = require('fixed-merkle-tree')

const DepositVerifier = artifacts.require('DepositVerifier')
const WithdrawVerifier = artifacts.require('WithdrawVerifier')
const TreeUpdateVerifier = artifacts.require('TreeUpdateVerifier')
const Poof = artifacts.require('Poof')

const { toFixedHex, poseidonHash2 } = require('../src/utils')

const emptyTree = new MerkleTree(process.env.MERKLE_TREE_HEIGHT, [], {
  hashFunction: poseidonHash2,
})

module.exports = function (deployer) {
  return deployer.then(async () => {
    const depositVerifier = await DepositVerifier.deployed()
    const withdrawVerifier = await WithdrawVerifier.deployed()
    const treeUpdateVerifier = await TreeUpdateVerifier.deployed()

    await deployer.deploy(
      Poof,
      process.env.ERC20,
      [
        depositVerifier.address,
        withdrawVerifier.address,
        treeUpdateVerifier.address,
      ],
      toFixedHex(emptyTree.root()),
    )
  })
}
