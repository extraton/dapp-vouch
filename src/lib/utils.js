import BigNumber from "bignumber.js";

export default {
  isAddressValid(address) {
    return address.match(/^(-1|0):[a-fA-F0-9]{64}$/g) !== null;
  },
  addressToView(address) {
    const upperCaseAddress = address.toUpperCase();
    return `${upperCaseAddress.substr(0, 8)}...${upperCaseAddress.substr(-6)}`;
  },
  convertViewFromNano(nanoAmount) {
    return new BigNumber(nanoAmount).dividedBy(new BigNumber('1000000000')).toFormat(3);
  },
  toNano(amount) {
    return new BigNumber(amount).multipliedBy(new BigNumber('1000000000')).toString();
  },
  stringNumberToHex(str) {
    return '0x'+(new BigNumber(str).toString(16).toUpperCase());
  },
};
