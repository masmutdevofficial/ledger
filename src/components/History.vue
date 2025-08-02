<template>
  <div class="w-full" style="margin-bottom: 100px">
    <div v-if="alert" class="bg-red-500 text-white p-3 rounded">
      {{ alert.message }}
    </div>
    <div class="flex flex-col justify-center items-center w-full">
      <div
        v-for="history in historyData"
        :key="history.id"
        class="bg-gray-100 dark:bg-gray-400 rounded-lg w-full mb-4"
      >
        <div class="p-3">
          <div class="flex flex-row justify-between items-start w-full mb-3">
            <p class="dark:text-white">{{ history.pair }}</p>
            <div class="flex flex-col justify-end items-end">
              <p class="text-end dark:text-white">{{ $t("purchase_time") }}</p>
              <p class="text-end dark:text-white">
                {{ history.purchase_time }}
              </p>
            </div>
          </div>
          <div class="flex flex-row justify-between items-start w-full mb-3">
            <div class="flex flex-col justify-end items-center">
              <p class="dark:text-white">{{ $t("type") }}</p>
              <p class="text-green-500 dark:text-green-800">
                {{ history.type }}
              </p>
            </div>
            <div
              class="flex flex-col justify-end items-center"
              style="margin-left: 48px"
            >
              <p class="dark:text-white">{{ $t("profit_and_loss") }}</p>
              <p
                :class="{
                  'text-green-500 dark:text-green-800': history.profit_loss > 0,
                  'text-red-500 dark:text-red-800': history.profit_loss < 0,
                }"
              >
                {{ history.profit_loss > 0 ? "+" : ""
                }}{{ Math.floor(history.profit_loss) }}
              </p>
            </div>
            <div class="flex flex-col justify-end">
              <p class="dark:text-white">{{ $t("order_duration") }}</p>
              <p class="text-end dark:text-white">
                {{ history.order_duration }}
              </p>
            </div>
          </div>
          <div
            class="flex flex-row justify-between items-start w-full mb-3 border-b border-black"
          >
            <div class="flex flex-col justify-end items-center">
              <p class="dark:text-white">USDT</p>
              <p class="dark:text-white">{{ Math.floor(history.amount) }}</p>
            </div>
            <div class="flex flex-col justify-end items-center">
              <p class="dark:text-white">{{ $t("purchase_price") }}</p>
              <p class="dark:text-white">
                {{ formatNumber(history.purchase_price, 2) }}
              </p>
            </div>
            <div class="flex flex-col justify-end mb-3">
              <p class="text-end dark:text-white">{{ $t("sell") }}</p>
              <p class="text-end dark:text-white">
                {{ formatNumber(history.sell_price, 2) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const historyData = ref([]);
    const alert = ref(null);
    const apiUrl = "https://ledger.masmutdev.id/api/history-crypto-order";

    const fetchHistoryData = async () => {
      const jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert.value = {
          message: "JWT Token tidak ditemukan. Silakan login kembali.",
          type: "error",
        };
        return;
      }

      try {
        const response = await axios.post(
          apiUrl,
          {},
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        historyData.value = response.data;
      } catch (error) {
        alert.value = {
          message: "Gagal mengambil data riwayat transaksi.",
          type: "error",
        };
      }
    };

    const formatNumber = (value, decimals = 2) => {
      if (!value) return "0";
      return parseFloat(value)
        .toFixed(decimals)
        .replace(/\.?0+$/, ""); // Menghapus nol di belakang koma
    };

    onMounted(fetchHistoryData);

    return {
      historyData,
      alert,
      formatNumber, // Harus dikembalikan agar bisa digunakan di template
    };
  },
};
</script>
