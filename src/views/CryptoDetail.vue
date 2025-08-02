<template>
  <!-- Header -->
  <div class="p-4 w-full">
    <router-link to="/dashboard" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <img
        :src="`/assets/images/crypto/${symbol.toLowerCase()}.webp`"
        alt=""
        class="me-3 ms-3"
      />
      <span class="text-lg font-semibold dark:text-white"
        >{{ symbol.toUpperCase() }} / USDT</span
      >
    </router-link>

    <div class="flex flex-row justify-between items-start mb-6">
      <!-- Price and Details -->
      <div class="flex flex-row justify-between items-start">
        <div class="flex flex-col justify-start text-black text-sm">
          <div class="text-3xl font-bold mb-2 dark:text-white">
            {{ marketData.close || "Loading..." }}
          </div>
          <div
            :class="
              previousSignData[symbol] && previousSignData[symbol].includes('+')
                ? 'text-green-500'
                : 'text-red-500'
            "
          >
            {{ formatChange(symbol, priceChangePercentage) }}
          </div>
        </div>
      </div>

      <div
        class="flex flex-col justify-end items-end text-black dark:text-white text-sm"
      >
        <div>
          {{ $t("24h_volume") }}
          <span class="text-black font-semibold dark:text-white">
            {{ formatNumber(marketData.amount, "K") }}
          </span>
        </div>
        <div>
          {{ $t("24h_turnover") }}
          <span class="text-black font-semibold dark:text-white">
            {{ formatNumber(marketData.vol, "M") }}
          </span>
        </div>
      </div>
    </div>

    <!-- Time Options -->
    <div class="flex justify-start text-black dark:text-white text-sm mb-4">
      <div class="me-3 dark:text-white">{{ $t("time_shared") }}</div>
      <div class="flex space-x-2">
        <div
          :class="{ 'text-green-500': selectedPeriod === '1min' }"
          @click="setPeriod('1min')"
          style="cursor: pointer"
        >
          1m
        </div>
        <div
          :class="{ 'text-green-500': selectedPeriod === '5min' }"
          @click="setPeriod('5min')"
          style="cursor: pointer"
        >
          5m
        </div>
        <div
          :class="{ 'text-green-500': selectedPeriod === '15min' }"
          @click="setPeriod('15min')"
          style="cursor: pointer"
        >
          15m
        </div>
        <div
          :class="{ 'text-green-500': selectedPeriod === '30min' }"
          @click="setPeriod('30min')"
          style="cursor: pointer"
        >
          30m
        </div>
      </div>
    </div>

    <!-- Open, High, Low -->
    <div class="flex flex-row justify-start text-black text-sm overflow-auto">
      <div class="flex flex-row me-2">
        <p class="dark:text-white">{{ $t("open") }}=</p>
        <p class="text-green-500">{{ marketData.open || "Loading..." }}</p>
      </div>
      <div class="flex flex-row me-2">
        <p class="dark:text-white">{{ $t("high") }}=</p>
        <p class="text-green-500">{{ marketData.high || "Loading..." }}</p>
      </div>
      <div class="flex flex-row">
        <p class="dark:text-white">{{ $t("low") }}=</p>
        <p class="text-green-500">{{ marketData.low || "Loading..." }}</p>
      </div>
    </div>
  </div>

  <!-- Chart -->
  <CryptoDetailMarket
    :symbol="symbol.toLowerCase() + 'usdt'"
    :period="selectedPeriod"
  />

  <!-- Order List and Latest Trades -->
  <div class="p-4 w-full overflow-auto" style="margin-bottom: 100px">
    <div class="flex justify-center items-center mb-4">
      <div
        class="text-red-500 font-semibold text-lg border-b-2 border-red-500 pb-1"
      >
        {{ $t("order_list") }}
      </div>
    </div>
    <div class="flex flex-row justify-around items-center">
      <div class="text-gray-500 dark:text-white">{{ $t("amount_buy") }}</div>
      <div class="text-gray-500 dark:text-white">{{ $t("price_usdt") }}</div>
      <div class="text-gray-500 dark:text-white">{{ $t("amount_sell") }}</div>
    </div>

    <OrderData :symbol="symbol" />

    <!-- Buy and Sell Buttons -->
    <div class="flex justify-between mt-4">
      <router-link
        :to="{ path: `/buy/${symbol}` }"
        class="bg-green-500 text-white font-bold py-2 px-4 rounded-lg border-2 w-1/2 mr-2 text-center"
      >
        {{ $t("buy") }}
      </router-link>
      <router-link
        :to="{ path: `/sell/${symbol}` }"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg border-2 w-1/2 ml-2 text-center"
      >
        {{ $t("sell_action") }}
      </router-link>
    </div>
  </div>

  <StickyFooter />
</template>

<script>
import axios from "axios";
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import StickyFooter from "@/components/StickyFooter.vue";
import CryptoDetailMarket from "@/components/CryptoDetailMarket.vue";
import OrderData from "@/components/OrderData.vue";
import { IconArrowLeft } from "@tabler/icons-vue";

export default {
  name: "CryptoDetail",
  setup() {
    const route = useRoute();
    const symbol = ref(route.params.symbol);
    const marketData = ref({
      open: 0,
      close: 0,
      low: 0,
      high: 0,
      amount: 0,
      vol: 0,
    });
    // Reactive variable untuk periode (default '1min')
    const selectedPeriod = ref("1min");

    // Fungsi untuk mengubah periode
    const setPeriod = (period) => {
      selectedPeriod.value = period;
    };

    const previousCryptoData = ref({});
    const previousSignData = ref({});

    let intervalId = null;

    const priceChangePercentage = computed(() => {
      if (!marketData.value.open || !marketData.value.close) return "0.00";
      return (
        ((marketData.value.close - marketData.value.open) /
          marketData.value.open) *
        100
      ).toFixed(2);
    });

    // Fungsi untuk format perubahan harga
    const formatChange = (symbol, currentChange) => {
      const previousChange = previousCryptoData.value[symbol] || 0;

      if (currentChange > previousChange) {
        previousSignData.value[symbol] = `+${Math.abs(currentChange)}%`;
      } else if (currentChange < previousChange) {
        previousSignData.value[symbol] = `-${Math.abs(currentChange)}%`;
      } else {
        previousSignData.value[symbol] =
          previousSignData.value[symbol] || `${currentChange}%`;
      }

      previousCryptoData.value[symbol] = currentChange; // Simpan perubahan terbaru
      return previousSignData.value[symbol];
    };

    // Fungsi untuk memformat angka ke format K (ribu) dan M (juta)
    const formatNumber = (num, type) => {
      if (!num) return "0.00";
      if (type === "K") return (num / 1000).toFixed(2) + "K";
      if (type === "M") return (num / 1000000).toFixed(2) + "M";
      return num.toFixed(2);
    };

    // Fungsi untuk fetch data dari API
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(
          `https://tes.zshot-ai.com/api/crypto-data-detail/${symbol.value}usdt`
        );

        // Simpan data sebelumnya sebelum update
        const oldClose = marketData.value.close;

        // Update data terbaru
        marketData.value = {
          open: Number(response.data.open) || 0,
          close: Number(response.data.close) || 0,
          low: Number(response.data.low) || 0,
          high: Number(response.data.high) || 0,
          amount: Number(response.data.amount) || 0,
          vol: Number(response.data.vol) || 0,
        };

        // Hitung perubahan harga dalam persen
        const priceChange = computed(() => {
          if (!marketData.value.open || !marketData.value.close) return "0.00";
          return (
            ((marketData.value.close - marketData.value.open) /
              marketData.value.open) *
            100
          ).toFixed(2);
        });

        // Simpan perubahan dengan format yang benar
        formatChange(symbol.value, parseFloat(priceChange.value));
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };

    // Jalankan fetch pertama kali & polling setiap 5 detik
    onMounted(() => {
      fetchMarketData();
      intervalId = setInterval(fetchMarketData, 5000);
    });

    // Hentikan polling saat komponen di-unmount
    onUnmounted(() => {
      clearInterval(intervalId);
    });

    // Jika symbol berubah, ambil data baru
    watch(
      () => route.params.symbol,
      (newSymbol) => {
        symbol.value = newSymbol;
        fetchMarketData();
      }
    );

    return {
      symbol,
      marketData,
      formatChange,
      previousSignData,
      formatNumber,
      priceChangePercentage,
      selectedPeriod,
      setPeriod,
    };
  },
  components: {
    StickyFooter,
    CryptoDetailMarket,
    OrderData,
    IconArrowLeft,
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
};
</script>

<style>
.tspan-class {
  color: black;
}

.dark .tspan-class {
  color: #ffffff; /* Warna untuk mode gelap */
}
</style>
