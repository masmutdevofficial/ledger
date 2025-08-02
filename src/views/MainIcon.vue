<template>
  <div class="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg w-full">
    <div class="text-center mb-4">
      <!-- Dropdown Select Crypto -->
      <select
        v-model="selectedCrypto"
        class="w-full mb-4 border p-2 rounded-md dark:bg-gray-700 dark:text-white"
      >
        <option v-for="crypto in datacrypto" :key="crypto" :value="crypto">
          {{ crypto.replace("usdt", "").toUpperCase() }} / USDT
        </option>
      </select>
      <div>
        <label
          for="delivery-time"
          class="block text-sm font-medium text-gray-600 dark:text-white"
        >
          Capital Allocation
        </label>
        <select
          id="delivery-time"
          v-model="selectedDuration"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="30" data-store="10">10%</option>
          <option value="45" data-store="20">20%</option>
          <option value="60" data-store="30">30%</option>
          <option value="75" data-store="40">40%</option>
          <option value="90" data-store="50">50%</option>
          <option value="105" data-store="60">60%</option>
          <option value="120" data-store="70">70%</option>
          <option value="135" data-store="80">80%</option>
          <option value="150" data-store="90">90%</option>
        </select>
      </div>
      <div class="mt-3">
        <label
          for="amount"
          class="block text-sm font-medium text-gray-600 dark:text-white"
        >
          Minimum 0 to Buy
        </label>
        <input
          id="amount"
          type="number"
          v-model="amount"
          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="USDT"
        />
      </div>
    </div>

    <div class="text-right mb-2 text-gray-600 dark:text-white text-sm">
      Transaction Fee: <span>0%</span>
    </div>
    <div class="text-right mb-4 text-black dark:text-white text-lg">
      Available Balance: <span class="font-bold">{{ availableBalance }}</span>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <button
        @click="submitTransaction('Buy')"
        class="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
      >
        Buy
      </button>
      <button
        @click="submitTransaction('Sell')"
        class="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600"
      >
        Sell
      </button>
    </div>
    <div class="mt-6 w-full" style="margin-bottom: 100px">
      <div class="flex justify-center items-center mb-4">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          @click="changeTab(tab)"
          :class="[
            'px-4 py-2 cursor-pointer font-semibold',
            activeTab === tab
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-500',
          ]"
        >
          {{ tab }}
        </div>
      </div>

      <div v-if="activeTab === 'Order List'">
        <div
          v-if="transactions.length > 0"
          class="flex flex-col justify-center items-center w-full"
        >
          <div
            v-for="(transaction, index) in transactions"
            :key="index"
            class="bg-gray-100 dark:bg-gray-400 rounded-lg w-full mb-3"
          >
            <div class="p-3">
              <div
                class="flex flex-row justify-between items-start w-full mb-3"
              >
                <p class="dark:text-white">{{ transaction.pair }}</p>
                <div class="flex flex-col justify-end items-end">
                  <p class="text-end dark:text-white">
                    {{ $t("purchase_time") }}
                  </p>
                  <p class="text-end dark:text-white">
                    {{ transaction.purchase_time }}
                  </p>
                </div>
              </div>

              <div
                class="flex flex-row justify-between items-start w-full mb-3"
              >
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">{{ $t("type") }}</p>
                  <p
                    :class="
                      transaction.type === 'Buy'
                        ? 'text-green-500 dark:text-green-800'
                        : 'text-red-500 dark:text-red-800'
                    "
                  >
                    {{ transaction.type }}
                  </p>
                </div>
                <div
                  class="flex flex-col justify-end items-center"
                  style="margin-left: 48px"
                >
                  <p class="dark:text-white">Profit And Loss</p>
                  <p
                    :class="
                      transaction.profit_loss >= 0
                        ? 'text-green-500 dark:text-green-800'
                        : 'text-red-500 dark:text-red-800'
                    "
                  >
                    {{ transaction.profit_loss >= 0 ? "+" : ""
                    }}{{ transaction.profit_loss }}
                  </p>
                </div>
                <div class="flex flex-col justify-end">
                  <p class="dark:text-white">{{ $t("order_duration") }}</p>
                  <p class="text-end dark:text-white">
                    {{ transaction.order_duration }}s
                  </p>
                </div>
              </div>

              <div
                class="flex flex-row justify-between items-start w-full mb-3 border-b border-black"
              >
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">USDT</p>
                  <p class="dark:text-white">
                    {{ Math.floor(transaction.amount) }}
                  </p>
                </div>
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">{{ $t("purchase_price") }}</p>
                  <p class="dark:text-white">
                    {{ formatNumber(transaction.purchase_price, 2) }}
                  </p>
                </div>
                <div class="flex flex-col justify-end mb-3">
                  <p class="text-end dark:text-white">{{ $t("sell") }}</p>
                  <p class="text-end dark:text-white">
                    {{ formatNumber(transaction.sell_price, 2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-white">
          Belum ada transaksi.
        </div>
      </div>
      <div v-if="activeTab === 'Open Orders'">
        <div
          v-if="transactions.length > 0"
          class="flex flex-col justify-center items-center w-full"
        >
          <div
            v-for="(transaction, index) in transactions"
            :key="index"
            class="bg-gray-100 dark:bg-gray-400 rounded-lg w-full mb-3"
          >
            <div class="p-3">
              <div
                class="flex flex-row justify-between items-start w-full mb-3"
              >
                <p class="dark:text-white">{{ transaction.pair }}</p>
                <div class="flex flex-col justify-end items-end">
                  <p class="text-end dark:text-white">
                    {{ $t("purchase_time") }}
                  </p>
                  <p class="text-end dark:text-white">
                    {{ transaction.purchase_time }}
                  </p>
                </div>
              </div>

              <div
                class="flex flex-row justify-between items-start w-full mb-3"
              >
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">{{ $t("type") }}</p>
                  <p
                    :class="
                      transaction.type === 'Buy'
                        ? 'text-green-500 dark:text-green-800'
                        : 'text-red-500 dark:text-red-800'
                    "
                  >
                    {{ transaction.type }}
                  </p>
                </div>
                <div
                  class="flex flex-col justify-end items-center"
                  style="margin-left: 48px"
                >
                  <p class="dark:text-white">Capital Allocation</p>
                  <p>
                    {{
                      countdownTimers[transaction.id] !== undefined
                        ? countdownTimers[transaction.id]
                        : transaction.order_duration
                    }}s
                  </p>
                </div>
                <div class="flex flex-col justify-end">
                  <p class="dark:text-white">{{ $t("order_duration") }}</p>
                  <p class="text-end dark:text-white">
                    {{ transaction.order_duration }}s
                  </p>
                </div>
              </div>

              <div
                class="flex flex-row justify-between items-start w-full mb-3 border-b border-black"
              >
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">USDT</p>
                  <p class="dark:text-white">
                    {{ Math.floor(transaction.amount) }}
                  </p>
                </div>
                <div class="flex flex-col justify-end items-center">
                  <p class="dark:text-white">{{ $t("purchase_price") }}</p>
                  <p class="dark:text-white">
                    {{ formatNumber(transaction.purchase_price, 2) }}
                  </p>
                </div>
                <div class="flex flex-col justify-end mb-3">
                  <p class="text-end dark:text-white">{{ $t("sell") }}</p>
                  <p class="text-end dark:text-white">
                    {{ formatNumber(transaction.sell_price, 2) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-500 dark:text-white">
          Belum ada transaksi.
        </div>
      </div>
    </div>
    <!-- Modal Alert -->
    <div
      v-if="alert.message"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="p-4 rounded-lg flex flex-col justify-center items-center text-center w-[300px] bg-black/70 text-white"
      >
        <div class="mb-3">
          <svg
            v-if="alert.type === 'success'"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p>{{ alert.message }}</p>
        <button
          @click="
            alert.message = '';
            fetchHistoryTransaksi();
          "
          class="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          OK
        </button>
      </div>
    </div>
  </div>

  <StickyFooter />
</template>

<script>
import { useCardDataStore } from "@/stores/cardData";
import { mapState } from "pinia";
import axios from "axios";
import StickyFooter from "@/components/StickyFooter.vue";

export default {
  name: "CryptoOrderUI",
  components: {
    StickyFooter,
  },
  props: {
    symbol: String, // Pair dari URL
  },
  data() {
    return {
      tabs: ["Open Orders", "Order List"],
      activeTab: "Open Orders",
      selectedDuration: "30",
      amount: null,
      transactions: [], // Menyimpan data transaksi dari API
      countdownTimers: {}, // Menyimpan waktu hitung mundur per transaksi
      timeouts: {}, // Menyimpan referensi setTimeout untuk masing-masing transaksi
      durationStoreMap: {
        30: 10,
        45: 20,
        60: 30,
        75: 40,
        90: 50,
        105: 60,
        120: 70,
        135: 80,
        150: 90,
      },
      selectedCrypto: "btcusdt", // Default crypto pair
      datacrypto: [
        "btcusdt",
        "ethusdt",
        "solusdt",
        "tronbullusdt",
        "xrpusdt",
        "suiusdt",
        "tonusdt",
        "polusdt",
        "galausdt",
        "adausdt",
        "dogeusdt",
        "linkusdt",
        "qtumusdt",
        "ltcusdt",
        "radusdt",
        "thetausdt",
        "algousdt",
        "bandusdt",
        "bnbusdt",
        "lunausdt",
        "pepeusdt",
      ],
      alert: { message: "", type: "" },
    };
  },
  computed: {
    ...mapState(useCardDataStore, ["userData"]),
    availableBalance() {
      return this.userData?.info_user?.saldo || 0;
    },
  },
  mounted() {
    const store = useCardDataStore();
    store.fetchCardData();
    this.fetchHistoryTransaksi();
    // Ambil kembali countdown dari localStorage saat komponen dimuat
    setTimeout(() => {
      this.transactions.forEach((transaction) => {
        this.startCountdown(transaction);
      });
    }, 500);
  },
  methods: {
    async submitTransaction(type) {
      try {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) {
          this.alert = {
            message: "JWT Token tidak ditemukan. Silakan login kembali.",
            type: "error",
          };
          return;
        }

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Tambah 1 karena getMonth() dimulai dari 0
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        const purchaseTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const pair = this.selectedCrypto;
        const orderDuration = parseInt(this.selectedDuration);
        const deliveryOrder = this.durationStoreMap[orderDuration];
        const profitLoss = (deliveryOrder / 100) * (this.amount || 0);

        const formData = new FormData();
        formData.append("id_users", jwtToken);
        formData.append("type", type);
        formData.append("pair", pair);
        formData.append("purchase_time", purchaseTime);
        formData.append("order_duration", orderDuration);
        formData.append("amount", this.amount);
        formData.append("delivery_order", deliveryOrder);
        formData.append("profit_loss", profitLoss);
        formData.append("created_at", new Date().toISOString());
        formData.append("updated_at", new Date().toISOString());

        const response = await fetch(
          "https://ledger.masmutdev.id/api/transaksi-crypto-open-main",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${jwtToken}` },
            body: formData,
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          this.alert = {
            message: `Error: ${responseData.message}`,
            type: "error",
          };
          return;
        }

        this.alert = {
          message:
            "Transaction submitted successfully. Waiting for settlement...",
          type: "success",
        };

        // Tunggu selama orderDuration detik sebelum mengirimkan ke transaksi-crypto-order
        setTimeout(async () => {
          try {
            const orderFormData = new FormData();
            orderFormData.append("id_users", jwtToken);
            orderFormData.append("type", type);
            orderFormData.append("pair", pair);
            orderFormData.append("purchase_time", purchaseTime);
            orderFormData.append("order_duration", orderDuration);
            orderFormData.append("amount", this.amount);
            orderFormData.append("delivery_order", deliveryOrder);
            orderFormData.append("profit_loss", profitLoss);
            orderFormData.append("created_at", new Date().toISOString());
            orderFormData.append("updated_at", new Date().toISOString());

            const orderResponse = await fetch(
              "https://ledger.masmutdev.id/api/transaksi-crypto-order-main",
              {
                method: "POST",
                headers: { Authorization: `Bearer ${jwtToken}` },
                body: orderFormData,
              }
            );

            const orderResponseData = await orderResponse.json();

            if (!orderResponse.ok) {
              this.alert = {
                message: `Error: ${orderResponseData.message}`,
                type: "error",
              };
              return;
            }

            // Munculkan modal "Settlement Updated. Process Done"
            this.alert = {
              message: "Settlement Updated. Process Done",
              type: "success",
            };
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } catch (error) {
            console.error("Error processing settlement:", error);
            this.alert = {
              message: "Gagal memproses settlement.",
              type: "error",
            };
          }
        }, orderDuration * 1000); // Konversi detik ke milidetik
      } catch (error) {
        console.error("Error submitting transaction:", error);
        this.alert = { message: "Gagal mengirim transaksi.", type: "error" };
      }
    },
    async fetchHistoryTransaksi() {
      try {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) {
          this.alert = {
            message: "JWT Token tidak ditemukan. Silakan login kembali.",
            type: "error",
          };
          return;
        }

        let apiUrl =
          this.activeTab === "Open Orders"
            ? "https://ledger.masmutdev.id/api/history-crypto-open"
            : "https://ledger.masmutdev.id/api/history-crypto-order";

        const response = await axios.post(
          apiUrl,
          {},
          { headers: { Authorization: `Bearer ${jwtToken}` } }
        );

        if (response.status === 200) {
          this.transactions = response.data;

          // Mulai hitung mundur untuk setiap transaksi di Open Orders
          if (this.activeTab === "Open Orders") {
            this.transactions.forEach((transaction) => {
              this.startCountdown(transaction);
            });
          }
        } else {
          this.alert = {
            message: "Gagal mengambil data transaksi.",
            type: "error",
          };
        }
      } catch (error) {
        console.error("Error fetching history transaksi:", error);
        this.alert = {
          message: "Terjadi kesalahan saat mengambil data transaksi.",
          type: "error",
        };
      }
    },

    startCountdown(transaction) {
      const now = Math.floor(Date.now() / 1000); // Waktu sekarang dalam detik
      const startTimeKey = `transaction_start_${transaction.id}`;
      const savedStartTime = localStorage.getItem(startTimeKey);

      let startTime = savedStartTime ? parseInt(savedStartTime, 10) : null;
      if (!startTime) {
        startTime = now;
        localStorage.setItem(startTimeKey, startTime);
      }

      // Hitung sisa waktu berdasarkan waktu mulai yang tersimpan
      let timeLeft = transaction.order_duration - (now - startTime);

      if (timeLeft <= 0) {
        delete this.countdownTimers[transaction.id];
        this.submitOrder(transaction);
        return;
      }

      // Pastikan tidak ada interval lain berjalan
      if (this.countdownTimers[transaction.id]) return;

      this.countdownTimers[transaction.id] = timeLeft;

      const interval = setInterval(() => {
        if (this.countdownTimers[transaction.id] > 0) {
          this.countdownTimers[transaction.id] -= 1;
          localStorage.setItem(
            startTimeKey,
            now -
              (transaction.order_duration -
                this.countdownTimers[transaction.id])
          );
        } else {
          clearInterval(interval);
          delete this.countdownTimers[transaction.id];
          localStorage.removeItem(startTimeKey);
          this.submitOrder(transaction);
        }
      }, 1000);

      this.timeouts[transaction.id] = interval;
    },

    async submitOrder(transaction) {
      if (this.timeouts[transaction.id]) {
        return; // Cegah eksekusi lebih dari sekali
      }

      this.timeouts[transaction.id] = true; // Tandai bahwa transaksi ini sudah dijalankan

      try {
        const jwtToken = localStorage.getItem("jwt_token");
        if (!jwtToken) {
          this.alert = {
            message: "JWT Token tidak ditemukan. Silakan login kembali.",
            type: "error",
          };
          return;
        }

        const formData = new FormData();
        formData.append("id_users", jwtToken);
        formData.append("type", transaction.type);
        formData.append("pair", transaction.pair);
        formData.append("purchase_time", transaction.purchase_time);
        formData.append("order_duration", transaction.order_duration);
        formData.append("amount", transaction.amount);
        formData.append("delivery_order", transaction.delivery_order);
        formData.append("profit_loss", transaction.profit_loss);
        formData.append("created_at", new Date().toISOString());
        formData.append("updated_at", new Date().toISOString());

        const response = await fetch(
          "https://ledger.masmutdev.id/api/transaksi-crypto-order-main",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${jwtToken}` },
            body: formData,
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          this.alert = {
            message: `Error: ${responseData.message}`,
            type: "error",
          };
          return;
        }

        this.alert = {
          message: "Settlement Updated. Process Done",
          type: "success",
        };

        this.fetchHistoryTransaksi();
      } catch (error) {
        console.error("Error processing settlement:", error);
        this.alert = { message: "Gagal memproses settlement.", type: "error" };
      } finally {
        delete this.timeouts[transaction.id]; // Hapus flag agar tidak terjadi duplikasi lain
      }
    },

    formatNumber(value, decimals = 2) {
      if (!value) return "0";
      return parseFloat(value)
        .toFixed(decimals)
        .replace(/\.?0+$/, "");
    },
    async changeTab(tab) {
      this.activeTab = tab;
      this.transactions = []; // Kosongkan data transaksi sebelum fetch API
      await this.fetchHistoryTransaksi(); // Ambil data baru saat tab berubah
    },
    resetPage() {
      fetchHistoryTransaksi();
    },
  },
  watch: {
    activeTab(newTab) {
      if (newTab === "Open Orders") {
        this.transactions.forEach((transaction) => {
          this.startCountdown(transaction);
        });
      }
    },
  },
  beforeDestroy() {
    // Bersihkan semua interval dan timeout saat komponen dihancurkan
    Object.values(this.countdownTimers).forEach(clearInterval);
    Object.values(this.timeouts).forEach(clearTimeout);
  },
};
</script>

<style scoped>
button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
</style>
