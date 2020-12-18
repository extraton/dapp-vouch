<template>
  <v-card class="home">
    <v-card-title>Open multi-signature wallet</v-card-title>
    <v-card-text class="text-center">
      <div class="text-left"><router-link :to="{name: 'about'}">Supported contracts</router-link></div>
      <v-form @submit="open" onSubmit="return false;" v-model="valid" ref="form">
        <v-text-field v-model="address"
                      label="Address"
                      :rules="[rules.required, rules.address]"
                      style="margin-top:15px"
                      outlined/>
        <v-btn color="primary" type="submit">
          open
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import utils from "@/lib/utils";

export default {
  data: () => ({
    address: '',
    valid: false,
    rules: {
      required: value => !!value || 'Required.',
      address: value => utils.isAddressValid(value) || 'Incorrect address',
    },
  }),
  methods: {
    open() {
      if (this.$refs.form.validate()) {
        this.$router.push({name: 'wallet', params: {address: this.address.toLowerCase()}});
      }
    }
  },
}
</script>
<style lang="scss">
.home {
}
</style>
