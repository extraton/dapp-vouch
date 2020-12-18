<template>
  <v-card class="about">
    <v-card-title>About</v-card-title>
    <v-card-text>
      <div>
        ExtraTON.Vouch is decentralized application (DApp) made by
        <a href="https://extraton.io" target="_blank">extraton.io</a> team.
        <br/>The DApp helps you easily and securely use multi-signature wallets in FreeTON network.
        <br/>It's non-commercial, <a href="https://github.com/extraton/dapp-vouch" target="_blank">open-source</a>
        project.
        <br/>In order to use DApp install
        <a href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm" target="_blank">
          extraTON extension
        </a> to your Google Chrome browser.
      </div>

      <div class="about__howToUse">
        <h3>How to use</h3>
        Install <a href="https://chrome.google.com/webstore/detail/extraton/hhimbkmlnofjdajamcojlcmgialocllm"
                   target="_blank">
        extraTON extension
      </a> to your browser.
        <br/>Open extension with secret that is one of wallet custodians.
        <br/>Put wallet address in main page and press "open".
        <br/>Now you can securely initiate transaction and confirm them.
      </div>


      <div class="about__contracts">
        <h3>Supported contracts</h3>
        <ul>
          <li v-for="(item, i) in walletContract.getAll()" :key="i">
            <a :href="item.github" target="_blank">{{ item.name }}</a>
          </li>
        </ul>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import walletContract from "@/lib/walletContract";

export default {
  data: () => ({
    walletContract,
  }),
}
</script>

<style lang="scss">
.about {
  .v-card__text > div:not(:first-child) {
    margin-top: 20px;
  }
}
</style>
