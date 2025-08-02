<template>
  <!--Card Above-->
  <keep-alive>
    <CardAbove />
  </keep-alive>
  <!--2 Card-->
  <div class="flex flex-row justify-between w-full mb-4">
    <div
      class="rounded-xl w-full shadow-lg p-4 me-2 bg-gradient-to-r from-gray-400 to-white dark:from-gray-800 dark:to-gray-300"
    >
      <div class="flex flex-row justify-start relative">
        <div class="flex flex-col justify-start" style="z-index: 2">
          <p class="font-semibold text-sm mb-3 dark:text-white">
            {{ $t("wallet") }}
          </p>
          <p class="font-semibold text-sm mb-3 dark:text-white">
            ${{ wallet }}
          </p>
          <p class="font-semibold text-sm text-green-500">
            ${{ total_deposit }}
          </p>
        </div>
        <img
          src="@/assets/images/overlay-1.png"
          class="w-20"
          style="position: absolute; right: -13px; z-index: 0"
          alt=""
        />
      </div>
    </div>
    <div
      class="rounded-xl w-full shadow-lg p-4 ms-2 bg-gradient-to-r from-gray-400 to-white dark:from-gray-800 dark:to-gray-300"
    >
      <div class="flex flex-row justify-start relative">
        <div class="flex flex-col justify-start" style="z-index: 2">
          <p class="font-semibold text-sm mb-3 dark:text-white">
            {{ $t("earn") }}
          </p>
          <p class="font-semibold text-sm mb-3 dark:text-white">
            ${{ total_laba }}
          </p>
          <p class="font-semibold text-sm text-green-500">${{ total_rugi }}</p>
        </div>
        <img
          src="@/assets/images/overlay-2.png"
          class="w-20"
          style="position: absolute; right: -13px; z-index: 0"
          alt=""
        />
      </div>
    </div>
  </div>
  <CryptoList />
  <StickyFooter />
</template>

<script>
import { computed } from "vue";
import { useCardDataStore } from "@/stores/cardData";
import CardAbove from "@/components/CardAbove.vue";
import CryptoList from "@/components/CryptoList.vue";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "DashboardPage",
  components: {
    CryptoList,
    StickyFooter,
    CardAbove,
  },
  setup() {
    // Ambil store
    const cardDataStore = useCardDataStore();

    // Hitung nilai untuk wallet dan earn
    const wallet = computed(() => {
      return cardDataStore.userData?.info_user?.saldo || "0.00";
    });

    const total_deposit = computed(() => {
      return cardDataStore.userData?.total_deposit || "0.00";
    });

    const earn = computed(() => {
      return cardDataStore.userData?.info_user?.komisi || "0.00";
    });

    const total_laba = computed(() => {
      return cardDataStore.userData?.total_laba || "0.00";
    });

    const total_rugi = computed(() => {
      return cardDataStore.userData?.total_rugi || "0.00";
    });

    return {
      wallet,
      earn,
      total_deposit,
      total_laba,
      total_rugi,
    };
  },
};
</script>
