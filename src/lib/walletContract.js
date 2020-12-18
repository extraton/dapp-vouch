const SafeMultisigWalletAbi = require('@/contracts/SafeMultisigWallet.abi.json');
const SetcodeMultisigAbi = require('@/contracts/SetcodeMultisigWallet.abi.json');
const SetcodeMultisig2Abi = require('@/contracts/SetcodeMultisigWallet2.abi.json');

const _ = {
  contracts: [
    {id: 1, name: 'Safe Multisig Wallet', hash: '80d6c47c4a25543c9b397b71716f3fae1e2c5d247174c52e2c19bd896442b105', abi: SafeMultisigWalletAbi, github: 'https://github.com/tonlabs/ton-labs-contracts/tree/master/solidity/safemultisig'},
    {id: 2, name: 'Set Code Multisig Wallet', hash:  'e2b60b6b602c10ced7ea8ede4bdf96342c97570a3798066f3fb50a4b2b27a208', abi: SetcodeMultisigAbi, github: 'https://github.com/tonlabs/ton-labs-contracts/tree/master/solidity/setcodemultisig'},
    {id: 3, name: 'Set Code Multisig Wallet 2', hash: '207dc560c5956de1a2c1479356f8f3ee70a59767db2bf4788b1d61ad42cdad82', abi: SetcodeMultisig2Abi, github: 'https://github.com/tonlabs/ton-labs-contracts/tree/multisig-surf-v2/solidity/setcodemultisig'},
  ],
};
export default {
  findContractByHash: (hash) => {
    for (const contract of _.contracts) {
      if (contract.hash === hash) {
        return contract;
      }
    }
    return null;
  },
  getAll: () => _.contracts,
  getDefault: () => _.contracts[0],
}
