<template>
  <!--Card Above-->
  <keep-alive>
    <CardAbove />
  </keep-alive>
  <Wallet />
  <StickyFooter />
</template>

<script>
import CardAbove from "@/components/CardAbove.vue";
import Wallet from "@/components/Wallet.vue";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "WalletPage",
  components: {
    StickyFooter,
    CardAbove,
    Wallet,
  },
};
</script>
