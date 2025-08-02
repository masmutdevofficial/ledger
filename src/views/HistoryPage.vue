<template>
  <!--Card Above-->
  <keep-alive>
    <CardAbove />
  </keep-alive>
  <History />
  <StickyFooter />
</template>

<script>
import CardAbove from "@/components/CardAbove.vue";
import History from "@/components/History.vue";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "HistoryPage",
  components: {
    StickyFooter,
    CardAbove,
    History,
  },
};
</script>
