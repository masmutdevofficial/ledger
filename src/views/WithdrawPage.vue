<template>
  <!--Card Above-->
  <CardAbove />
  <Withdraw />
  <StickyFooter />
</template>

<script>
import CardAbove from "@/components/CardAbove.vue";
import Withdraw from "@/components/Withdraw.vue";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "WithdrawPage",
  components: {
    StickyFooter,
    CardAbove,
    Withdraw,
  },
};
</script>
