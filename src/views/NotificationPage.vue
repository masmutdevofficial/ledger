<template>
  <div class="p-4 w-full">
    <!-- Header -->
    <router-link to="/dashboard" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <span class="text-lg font-semibold text-black dark:text-white"
        >Notification</span
      >
    </router-link>

    <!-- Alert Error -->
    <div
      v-if="alert.message"
      :class="`p-3 mb-4 text-white ${
        alert.type === 'error'
          ? 'bg-red-500 dark:bg-red-700'
          : 'bg-green-500 dark:bg-green-700'
      }`"
    >
      {{ alert.message }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">
      Loading transactions...
    </div>

    <!-- Deposit Transactions -->
    <div v-if="transactions.deposits.length > 0">
      <div
        v-for="deposit in transactions.deposits"
        :key="deposit.id"
        class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-800"
      >
        <h2
          class="text-lg font-semibold text-center mb-0 text-black dark:text-white"
        >
          Deposit
        </h2>
        <p
          class="text-gray-500 dark:text-gray-400 text-center text-sm mt-0 mb-3"
        >
          {{ formatDateTime(deposit.created_at) }}
        </p>
        <div
          class="flex flex-col justify-center items-center mb-3 text-black dark:text-white"
        >
          <p><strong>Order ID:</strong> {{ deposit.order_id }}</p>
          <p><strong>Amount:</strong> ${{ deposit.jumlah }}</p>
        </div>
        <div
          class="flex flex-row justify-between items-center text-black dark:text-white"
        >
          <p><strong>Network:</strong> {{ deposit.via_bank }}</p>
          <p>
            <span
              :class="{
                'text-yellow-500': deposit.status === '1',
                'text-red-500': deposit.status === '2',
                'text-green-500': deposit.status === '0',
              }"
            >
              {{ getStatusText(deposit.status) }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Withdraw Transactions -->
    <div v-if="transactions.withdraws.length > 0">
      <div
        v-for="withdraw in transactions.withdraws"
        :key="withdraw.id"
        class="p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-2 bg-white dark:bg-gray-800"
      >
        <h2
          class="text-lg font-semibold text-center mb-0 text-black dark:text-white"
        >
          Withdraw
        </h2>
        <p
          class="text-gray-500 dark:text-gray-400 text-center text-sm mt-0 mb-3"
        >
          {{ formatDateTime(withdraw.created_at) }}
        </p>
        <div
          class="flex flex-col justify-center items-center mb-3 text-black dark:text-white"
        >
          <p><strong>Order ID:</strong> {{ withdraw.order_id }}</p>
          <p><strong>Amount:</strong> ${{ withdraw.jumlah }}</p>
        </div>
        <div
          class="flex flex-row justify-between items-center text-black dark:text-white"
        >
          <p><strong>Network:</strong> {{ withdraw.via_bank }}</p>
          <p>
            <span
              :class="{
                'text-yellow-500': withdraw.status === '1',
                'text-red-500': withdraw.status === '2',
                'text-green-500': withdraw.status === '0',
              }"
            >
              {{ getStatusText(withdraw.status) }}
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- No Transactions -->
    <div
      v-if="
        !loading &&
        transactions.deposits.length === 0 &&
        transactions.withdraws.length === 0
      "
      class="text-center text-gray-500 dark:text-gray-400"
    >
      No transaction history found.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { IconArrowLeft } from "@tabler/icons-vue";

export default {
  components: {
    IconArrowLeft,
  },
  setup() {
    const transactions = ref({ deposits: [], withdraws: [] });
    const loading = ref(false);
    const alert = ref({ message: "", type: "" });

    // Fungsi untuk memperbarui status baca transaksi
    const updateTransactionHistory = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert.value = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      try {
        await fetch("https://tes.zshot-ai.com/api/update-history-transaksi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        console.error("Error updating transaction history:", error);
      }
    };

    // Fungsi untuk mengambil transaksi
    const fetchTransactions = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert.value = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      loading.value = true;

      try {
        let response = await fetch(
          "https://tes.zshot-ai.com/api/cek-history-transaksi",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        let data = await response.json();

        if (response.ok) {
          transactions.value = {
            deposits: data.data.deposits || [],
            withdraws: data.data.withdraws || [],
          };
        } else {
          alert.value = {
            message: data.message || "Failed to fetch transactions",
            type: "error",
          };
        }
      } catch (error) {
        alert.value = { message: "Error fetching transactions", type: "error" };
      } finally {
        loading.value = false;
      }
    };

    const getStatusText = (status) => {
      if (status === "1") return "Pending";
      if (status === "2") return "Rejected";
      if (status === "0") return "Approved";
    };

    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    // Jalankan update lalu ambil transaksi
    onMounted(async () => {
      await updateTransactionHistory();
      await fetchTransactions();
    });

    return { transactions, loading, alert, formatDateTime, getStatusText };
  },
};
</script>

<style>
/* Custom styling */
</style>
