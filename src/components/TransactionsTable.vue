<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :mobile-breakpoint="100"
    :items-per-page="1000"
    class="transactionsTable"
    no-data-text="Pending transactions are missing"
    hide-default-footer
  >
    <template slot="top">
      <v-toolbar flat dense>
        <v-toolbar-title>Pending transactions</v-toolbar-title>
        <v-spacer></v-spacer>
        <create-transaction-dialog @afterCreate="$emit('afterCreate')" :multisig-address="address"/>
      </v-toolbar>
    </template>
    <template slot="item" slot-scope="props">
      <tr>
        <td>{{ utils.stringNumberToHex(props.item.id) }}</td>
        <td>
          <addr :address="props.item.dest"/>
        </td>
        <td style="text-align:center">{{ utils.convertViewFromNano(props.item.value) }} TON</td>
        <td style="text-align:center">{{ props.item.signsReceived }}/{{ props.item.signsRequired }}</td>
        <td style="text-align:center">
          <template v-if="!extensionAvailable">
            <install-extension/>
          </template>
          <template v-else-if="!iCustodian">You're not custodian</template>
          <template v-else-if="props.item.isConfirmedByMe">Confirmed by me</template>
          <template v-else>
            <v-btn @click="confirm(props.item)"
                   :disabled="disabled"
                   :loading="props.item.isConfirming"
                   color="primary"
                   x-small
            >
              Confirm
            </v-btn>
          </template>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import utils from "@/lib/utils";
import Addr from "@/components/Addr";
import InstallExtension from "@/components/InstallExtension";
import CreateTransactionDialog from "@/components/CreateTransactionDialog";
import wallet from "@/lib/wallet";

export default {
  components: {Addr, InstallExtension, CreateTransactionDialog},
  props: {items: Array, iCustodian: Boolean, extensionAvailable: Boolean, address: String},
  data: () => ({
    utils,
    headers: [
      {text: 'TxId', sortable: false, filterable: false,},
      {text: 'Destination', sortable: false, filterable: false,},
      {text: 'Amount', align: 'center', sortable: false, filterable: false,},
      {text: 'Confirmed', align: 'center', sortable: false, filterable: false,},
      {text: 'Confirm', align: 'center', sortable: false, filterable: false,},
    ],
    disabled: false,
  }),
  methods: {
    async confirm(transaction) {
      this.disabled = true;
      transaction.isConfirming = true;
      try {
        await wallet.confirmTransaction(this.address, utils.stringNumberToHex(transaction.id));
        this.$emit('afterConfirm');
      } catch (e) {
        console.error(e);
        if (e.code !== 1000) {
          throw e;
        }
      } finally {
        this.disabled = false;
        transaction.isConfirming = false;
      }
    }
  },
}
</script>

<style lang="scss">
.transactionsTable {
}
</style>
