<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" color="primary" small>
        create
      </v-btn>
    </template>
    <v-form v-model="valid" ref="form">
      <v-card>
        <v-card-title>
          Create transaction
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="address"
                        label="Address"
                        :rules="[rules.required, rules.address]"
                        style="margin-top:15px"
                        outlined/>
          <v-text-field v-model="amount"
                        type="number"
                        label="Amount"
                        :rules="[rules.required, rules.greaterThenZero]"
                        outlined/>
          <div class="red--text">{{ error }}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn @click="dialog = false" :disabled="loading" text>cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="create" :disabled="!valid" :loading="loading" color="primary" text>create</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import BigNumber from "bignumber.js";
import utils from "@/lib/utils";
import wallet from "@/lib/wallet";

export default {
  props: {multisigAddress: String},
  data: () => ({
    dialog: false,
    valid: true,
    loading: false,
    rules: {
      required: value => !!value || 'Required.',
      // integer: value => new BigNumber(value).isInteger() || 'Integer only',
      greaterThenZero(value) {
        return new BigNumber(value).isGreaterThan(new BigNumber('0')) || `Must be greater or equal 0.`
      },
      address: value => utils.isAddressValid(value) || 'Incorrect address',
    },
    address: '',
    amount: '10',
    error: '',
  }),
  methods: {
    async create() {
      this.loading = true;
      this.error = '';
      try {
        await wallet.submitTransaction(this.multisigAddress, this.address, utils.toNano(this.amount));
        this.$emit('afterCreate');
      } catch (e) {
        console.error(e);
        if (e.code !== 1000) {
          this.error = e.toString();
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
