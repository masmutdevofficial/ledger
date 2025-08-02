<template>
  <div
    class="min-h-screen w-full flex justify-center items-center"
    style="margin-bottom: 100px"
  >
    <div class="overflow-x-auto w-full max-w-4xl">
      <table
        class="table-auto border-collapse w-full text-[8px] text-left text-gray-300"
      >
        <thead
          class="bg-gray-400 dark:bg-slate-900 text-[8px] uppercase text-black dark:text-gray-400"
        >
          <tr>
            <th class="px-4 py-3 text-center">Name / 24h Transaction Volume</th>
            <th class="px-4 py-3 text-center">
              <div class="flex items-center space-x-2">
                <span>Latest Price</span>
                <button
                  @click="toggleSort"
                  class="text-black dark:text-gray-400 hover:text-white focus:outline-none"
                >
                  <svg
                    v-if="sortOrder === 'asc'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </th>
            <th class="px-4 py-3 text-center">Quote Change</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crypto in sortedCryptoList"
            :key="crypto.symbol"
            class="border-b border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            @click="navigateToMarket(crypto.image)"
          >
            <td class="flex items-center px-4 py-2 space-x-3">
              <img
                :src="`/assets/images/crypto/${crypto.image}.webp`"
                class="rounded-full w-10"
                :alt="crypto.symbol"
                onerror="this.onerror=null; this.src='/assets/images/crypto/default.webp';"
              />
              <div>
                <p class="font-semibold text-black dark:text-gray-400">
                  {{ crypto.symbol }}
                </p>
                <p class="text-xs text-black dark:text-gray-400">
                  ${{ crypto.volume }} USDT
                </p>
              </div>
            </td>

            <td class="px-4 py-2 text-center">
              <p class="font-medium text-black dark:text-gray-400">
                {{ formatPrice(crypto.latestPrice) }}
              </p>
              <p class="text-xs text-black dark:text-gray-400">
                ≈ {{ formatPrice(crypto.latestPriceApprox) }}
              </p>
            </td>

            <td class="px-4 py-2 font-medium text-center">
              <div :class="getBackgroundColor(crypto.symbol, crypto.change)">
                {{ formatChange(crypto.symbol, crypto.change) }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="text-center text-gray-500 py-4">
        Loading...
      </div>
      <div v-if="error" class="text-center text-red-500 py-4">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CryptoDataTable",
  data() {
    return {
      cryptoList: [],
      previousCryptoData: {}, // Menyimpan nilai perubahan harga sebelumnya
      previousBackgroundData: {}, // Menyimpan warna background sebelumnya
      previousSignData: {}, // Menyimpan tanda sebelumnya
      loading: false,
      error: null,
      sortOrder: "asc",
      intervalId: null,
    };
  },
  computed: {
    sortedCryptoList() {
      return [...this.cryptoList].sort((a, b) => {
        return this.sortOrder === "desc"
          ? a.latestPrice - b.latestPrice
          : b.latestPrice - a.latestPrice;
      });
    },
  },
  methods: {
    async fetchCryptoList() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(
          "https://ledger.masmutdev.id//api/get-crypto-list"
        );
        if (!response.ok) throw new Error("Gagal mengambil data dari server.");
        const data = await response.json();

        const newCryptoData = data.map((crypto) => {
          const vol = parseFloat(crypto.vol) || 0;
          const open = parseFloat(crypto.open) || 0;
          const close = parseFloat(crypto.close) || 0;
          const quoteChange = (((close - open) / open) * 100).toFixed(2); // Hitung perubahan harga

          return {
            image: crypto.symbol.replace("usdt", ""), // Hapus "USDT"
            symbol: crypto.symbol.replace("usdt", "").toUpperCase() + " / USDT", // Hapus "USDT"
            volume: `${vol.toFixed(2)}`,
            latestPrice: close, // Harga penutupan
            latestPriceApprox: `${close.toFixed(2)}`, // Format harga dengan aman
            change: parseFloat(quoteChange), // Pastikan nilai berupa angka
          };
        });

        // Simpan nilai perubahan harga sebelumnya
        this.previousCryptoData = this.cryptoList.reduce((acc, item) => {
          acc[item.symbol] = item.change;
          return acc;
        }, {});

        this.cryptoList = newCryptoData; // Simpan data terbaru
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    getBackgroundColor(symbol, currentChange) {
      const previousChange = this.previousCryptoData[symbol] || 0;
      if (currentChange > previousChange) {
        this.previousBackgroundData[symbol] =
          "bg-green-500 rounded-lg px-4 py-1 text-white text-center";
      } else if (currentChange < previousChange) {
        this.previousBackgroundData[symbol] =
          "bg-red-500 rounded-lg px-4 py-1 text-white text-center";
      }
      // Jika nilainya tetap, gunakan warna sebelumnya
      return (
        this.previousBackgroundData[symbol] ||
        "bg-gray-500 rounded-lg px-4 py-1 text-white text-center"
      );
    },
    formatChange(symbol, currentChange) {
      const previousChange = this.previousCryptoData[symbol] || 0;

      if (currentChange > previousChange) {
        this.previousSignData[symbol] = `+${Math.abs(currentChange)}%`; // Pastikan hanya 1 tanda +
      } else if (currentChange < previousChange) {
        this.previousSignData[symbol] = `-${Math.abs(currentChange)}%`; // Pastikan hanya 1 tanda -
      } else {
        // Jika tidak berubah, gunakan tanda sebelumnya
        this.previousSignData[symbol] =
          this.previousSignData[symbol] || `${currentChange}%`;
      }

      return this.previousSignData[symbol];
    },
    formatPrice(price) {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    navigateToMarket(symbol) {
      this.$router.push(`/market/${symbol.toLowerCase()}`);
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
  },
  mounted() {
    this.fetchCryptoList();

    this.intervalId = setInterval(() => {
      this.fetchCryptoList();
    }, 3000);
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>

<style scoped>
.table-auto {
  border-spacing: 0;
  width: 100%;
}
.table-auto th,
.table-auto td {
  padding: 1rem;
}
.table-auto th {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}
.table-auto td {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
