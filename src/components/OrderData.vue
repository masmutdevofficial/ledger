<template>
  <div class="flex flex-row justify-between gap-4 text-center text-sm">
    <!-- Kolom Order Buy -->
    <div class="flex flex-col justify-between w-full">
      <!-- Looping data untuk order buy -->
      <div
        v-for="(item, index) in orderData.buy"
        :key="'buy-' + index"
        class="flex flex-row justify-between items-center relative"
      >
        <!-- Background bar dengan lebar dinamis berdasarkan item.price -->
        <div
          :style="{
            position: 'absolute',
            top: '0',
            bottom: '0',
            right: '0',
            width: getWidth(item.price),
            zIndex: 0,
            opacity: 0.1,
          }"
          class="bg-green-500 transition-all duration-500"
        ></div>
        <!-- Menampilkan jumlah (amount) dan harga (price) -->
        <div class="text-black dark:text-white relative z-10">
          {{ item.amount }}
        </div>
        <div class="text-green-500 relative z-10">{{ item.price }}</div>
      </div>
    </div>

    <!-- Kolom Order Sell -->
    <div class="flex flex-col justify-between w-full">
      <!-- Looping data untuk order sell -->
      <div
        v-for="(item, index) in orderData.sell"
        :key="'sell-' + index"
        class="flex flex-row justify-between relative"
      >
        <!-- Background bar dengan lebar dinamis berdasarkan item.price -->
        <div
          :style="{
            position: 'absolute',
            top: '0',
            bottom: '0',
            left: '0',
            width: getWidth(item.price),
            zIndex: 0,
            opacity: 0.1,
          }"
          class="bg-red-500 transition-all duration-500"
        ></div>
        <!-- Menampilkan jumlah (amount) dan harga (price) -->
        <div class="text-red-500 relative z-10">{{ item.amount }}</div>
        <div class="text-black dark:text-white relative z-10">
          {{ item.price }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, watch, onUnmounted, computed } from "vue";

export default {
  name: "OrderData",
  props: {
    symbol: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const orderData = ref({
      buy: [],
      sell: [],
    });

    // Mengambil data order dari API
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `https://ledger.masmutdev.id/api/latest-trade/${props.symbol}usdt`
        );

        // Menentukan struktur data yang diterima
        let orders = [];
        if (Array.isArray(response.data)) {
          orders = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          orders = response.data.data;
        } else if (
          typeof response.data === "object" &&
          response.data !== null
        ) {
          orders = Object.values(response.data);
        }

        orderData.value = {
          buy: orders.filter(
            (item) => item.direction && item.direction.toLowerCase() === "buy"
          ),
          sell: orders.filter(
            (item) => item.direction && item.direction.toLowerCase() === "sell"
          ),
        };
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    // Menghitung harga maksimum dari semua order
    const maxPrice = computed(() => {
      const allOrders = [...orderData.value.buy, ...orderData.value.sell];
      if (allOrders.length === 0) return 1; // mencegah pembagian dengan nol
      return Math.max(...allOrders.map((item) => item.price));
    });

    // Fungsi untuk menghitung lebar dinamis berdasarkan item.price
    const getWidth = (price) => {
      const max = maxPrice.value;
      const percentage = max ? (price / max) * 100 : 0;
      // Pastikan lebar tidak melebihi 100%
      return percentage > 100 ? "100%" : percentage + "%";
    };

    // Fetch data saat komponen di-mount dan setiap 5 detik
    let intervalId = null;
    onMounted(() => {
      fetchOrderData();
      intervalId = setInterval(fetchOrderData, 5000);
    });

    // Watcher untuk memantau perubahan props.symbol
    watch(
      () => props.symbol,
      (newSymbol, oldSymbol) => {
        if (newSymbol !== oldSymbol) {
          fetchOrderData();
        }
      }
    );

    // Membersihkan interval saat komponen di-unmount
    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    });

    return {
      orderData,
      getWidth,
    };
  },
};
</script>

<style scoped>
/* Tambahkan styling tambahan jika diperlukan */
</style>
