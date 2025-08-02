<template>
  <!--Card Above-->
  <keep-alive>
    <CardAbove />
  </keep-alive>
  <Deposit />
  <StickyFooter />
</template>

<script>
import CardAbove from "@/components/CardAbove.vue";
import Deposit from "@/components/Deposit.vue";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "DepositPage",
  components: {
    StickyFooter,
    CardAbove,
    Deposit,
  },
};
</script>
