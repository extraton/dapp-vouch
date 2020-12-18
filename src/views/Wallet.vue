<template>
  <div class="wallet">
    <v-card>
      <v-card-title>Wallet</v-card-title>
      <v-card-text class="text-center">
        <template v-if="globalError">
          <v-alert type="error" outlined>{{ globalError }}</v-alert>
        </template>
        <template v-else>
          <v-simple-table class="wallet__infoTable">
            <template v-slot:default>
              <tbody>
              <tr v-for="(item, i) in infoTableData" :key="i">
                <td>{{ item.name }}</td>
                <td>
                  <template v-if="item.type==='addr'">
                    <addr :address="item.value"/>
                  </template>
                  <template v-else-if="item.type==='install'"><install-extension/></template>
                  <template v-else-if="item.type==='green'">
                    <span class="green--text">{{ item.value }}</span>
                  </template>
                  <template v-else-if="item.type==='red'">
                    <span class="red--text">{{ item.value }}</span>
                  </template>
                  <template v-else>{{ item.value }}</template>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
          <template v-if="loading">
            <v-progress-circular class="wallet__loading" :size="50" :width="4" color="primary" indeterminate/>
          </template>
        </template>
      </v-card-text>
    </v-card>

    <transactions-table v-if="!loading && null !== contract && null === globalError"
                        @afterConfirm="load"
                        @afterCreate="load"
                        :address="$route.params.address"
                        :items="transactions"
                        :i-custodian="amICustodian"
                        :extension-available="isExtensionAvailable"
                        class="wallet__transactions"
    />
  </div>
</template>

<script>
import utils from "@/lib/utils";
import wallet from "@/lib/wallet";
import ton from "@/lib/ton";
import walletContract from "@/lib/walletContract";
import freeton from "freeton";
import TransactionsTable from "@/components/TransactionsTable";
import Addr from "@/components/Addr";
import InstallExtension from "@/components/InstallExtension";

export default {
  components: {Addr, TransactionsTable, InstallExtension},
  data: () => ({
    globalError: null,
    loading: true,
    addressData: null,
    contract: null,
    infoTableData: [],
    amICustodian: null,
    publicKey: null,
    custodianIndex: null,
    transactions: [],
    isExtensionAvailable: false,
  }),
  mounted() {
    this.load();
  },
  methods: {
    addToInfoTable(name, type, value = null) {
      this.infoTableData.push({name, type, value});
    },
    async setAmICustodian(custodians) {
      if (window.freeton !== undefined) {
        const provider = new freeton.providers.ExtensionProvider(window.freeton);
        const signer = await provider.getSigner();
        this.publicKey = signer.getPublicKey();
        this.amICustodian = false;
        for (const custodian of custodians) {
          if (custodian.pubkey === `0x${this.publicKey}`) {
            this.amICustodian = true;
            this.custodianIndex = custodian.index;
            break;
          }
        }
      }
    },
    async load() {
      this.loading = true;
      this.infoTableData = [];
      try {
        this.isExtensionAvailable = ton.isExtensionAvailable();
        if (this.isExtensionAvailable && !await ton.isExtensionAvailableWithMinimalVersion()) {
          throw 'Please, update extraTON extension to 0.5.0 minimal version.';
        }
        if (!utils.isAddressValid(this.$route.params.address)) {
          throw 'Address is not valid.';
        }
        this.addToInfoTable('Address', 'addr', this.$route.params.address);
        this.addressData = await ton.findAddressData(this.$route.params.address);
        if (null === this.addressData) {
          throw 'Address was not found.';
        }
        // this.contract = walletContract.findContractByHash(this.addressData.code_hash);
        this.contract = walletContract.getDefault();
        // if (null === this.contract) {
        //   throw 'This address does not contain supported wallet contract.';
        // }
        let custodians;
        try {
          custodians = await wallet.getCustodians(this.contract.abi, this.$route.params.address, this.addressData.boc);
        } catch (e) {
          throw 'Error during custodians check. Probably that\'s not a wallet contract.';
        }
        await this.setAmICustodian(custodians);
        this.transactions = await wallet.getTransactions(this.contract.abi, this.$route.params.address, this.addressData.boc, this.publicKey, this.custodianIndex);
        // this.addToInfoTable('Contract', 'text', this.contract.name);
        this.addToInfoTable('Custodians', 'text', custodians.length);
        if (null === this.amICustodian) {
          this.addToInfoTable('Am I Custodian?', 'install');
        } else if (false === this.amICustodian) {
          this.addToInfoTable('Am I Custodian?', 'red', 'no');
        } else {
          this.addToInfoTable('Am I Custodian?', 'green', 'yes');
        }
        this.addToInfoTable('Balance', 'text', utils.convertViewFromNano(this.addressData.balance) + ' TON');
      } catch (e) {
        console.error(e);
        this.globalError = e.toString();
      } finally {
        this.loading = false;
      }
    }
  },
}
</script>
<style lang="scss">
.wallet {
  &__loading {
    margin: 50px 0;
  }

  &__infoTable {
    td:first-child {
      text-align: right;
      width: 50%;
    }

    td:last-child {
      text-align: left;
    }
  }

  &__transactions {
    margin-top: 20px;
  }
}
</style>
