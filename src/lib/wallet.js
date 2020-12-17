import ton from '@/lib/ton';

export default {
  async getCustodians(abi, address, boc) {
    const getCustodiansMessage = await ton.encodeGetMessage(abi, address, 'getCustodians');
    return (await ton.runTvm(abi, boc, getCustodiansMessage.message)).custodians;
  },
  async getTransactions(abi, address, boc, pub = null, custodianIndex = null) {
    const getCustodiansMessage = await ton.encodeGetMessage(abi, address, 'getTransactions');
    const transactions = (await ton.runTvm(abi, boc, getCustodiansMessage.message)).transactions;
    for (const transaction of transactions) {
      transaction.isConfirming = false;
      if (null !== pub && null !== custodianIndex) {
        const input = {mask: transaction.confirmationsMask, index: custodianIndex};
        const isConfirmedMessage = await ton.encodeGetMessage(abi, address, 'isConfirmed', input);
        transaction.isConfirmedByMe = (await ton.runTvm(abi, boc, isConfirmedMessage.message)).confirmed;
      } else {
        transaction.isConfirmedByMe = false;
      }
    }
    return transactions;
  },
  async confirmTransaction(address, txid) {
    const wallet = await ton.getWallet(address);
    const contractMessageProcessing = await wallet.confirmTransaction(txid);
    await contractMessageProcessing.wait();
  },
  async submitTransaction(from, to, amount) {
    const wallet = await ton.getWallet(from);
    const contractMessageProcessing = await wallet.transfer(to, amount, false);
    await contractMessageProcessing.wait();
  }
}
