<template>
  <div class="w-full" style="margin-bottom: 100px">
    <!-- Modal Alert -->
    <div
      v-if="alert.message"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="p-4 rounded-lg flex flex-col justify-center items-center text-center w-[300px] bg-black/70 text-white"
      >
        <p>{{ alert.message }}</p>
      </div>
    </div>

    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <IconArrowLeft class="text-xl cursor-pointer dark:text-white" />
      <h1 class="text-xl font-semibold dark:text-white">
        {{ $t("withdraw") }}
      </h1>
      <IconCalendar class="text-xl cursor-pointer dark:text-white" />
    </div>

    <!-- Payment Options -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2 dark:text-white">
        {{ $t("payment_option") }}
      </label>
      <select
        v-model="paymentOption"
        class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
      >
        <option value="">-- Select Payment Option --</option>
        <option value="Wallet">Wallet Address</option>
        <option value="Bank">Bank Transfer</option>
      </select>
    </div>

    <!-- Wallet Address Fields -->
    <div v-if="paymentOption === 'Wallet'">
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
        >
          {{ $t("network") }}
        </label>
        <div class="flex space-x-2">
          <button
            v-for="option in networkOptions"
            :key="option.value"
            @click.prevent="selectNetwork(option.value)"
            :class="[
              'network-option flex-grow p-2 rounded border font-bold',
              selectedNetwork === option.value
                ? 'border-teal-500 text-teal-500'
                : 'border-gray-300 text-gray-500',
            ]"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("address")
        }}</label>
        <input
          v-model="network_address"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
    </div>

    <!-- Bank Transfer Fields -->
    <div v-if="paymentOption === 'Bank'">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("account_owner")
        }}</label>
        <input
          v-model="accountOwner"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("bank_name")
        }}</label>
        <input
          v-model="bankName"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("account_number")
        }}</label>
        <input
          v-model="accountNumber"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
    </div>

    <!-- Common Fields (Amount & Password) -->
    <div v-if="paymentOption">
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("withdrawal_amount")
        }}</label>
        <input
          v-model="amount"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">{{
          $t("transaction_password")
        }}</label>
        <input
          v-model="password"
          type="password"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>
      <button
        type="button"
        @click="handleSubmit"
        :disabled="isSubmitting"
        class="w-full py-2 bg-teal-500 text-white rounded-md"
      >
        {{ isSubmitting ? "Processing..." : "Submit" }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import {
  IconArrowLeft,
  IconCalendar,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-vue";
import { useCardDataStore } from "@/stores/cardData";

export default {
  name: "WithdrawForm",
  components: {
    IconArrowLeft,
    IconCalendar,
    IconEye,
    IconEyeOff,
  },
  setup() {
    const cardDataStore = useCardDataStore();
    const paymentOption = ref("");
    const selectedNetwork = ref("");
    const network_address = ref("");
    const amount = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const alert = ref({ message: "", type: "" });
    const isSubmitting = ref(false);

    // Tambahkan variabel yang sebelumnya tidak didefinisikan
    const accountOwner = ref("");
    const bankName = ref("");
    const accountNumber = ref("");

    const networkOptions = ref([
      { value: "ERC20", label: "ERC20" },
      { value: "TRC20", label: "TRC20" },
      { value: "BANK", label: "BANK" },
    ]);

    const availableBalance = computed(() => {
      return cardDataStore.userData?.info_user?.saldo || 0;
    });

    const fetchData = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        return;
      }

      try {
        let response = await fetch(
          "https://tes.zshot-ai.com/api/get-data-bank",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        let result = await response.json();

        if (response.ok && result.bank_accounts.length > 0) {
          let bankData = result.bank_accounts[0]; // Ambil data pertama jika ada

          // Isi variabel dengan data dari API
          bankName.value = bankData.bank;
          accountNumber.value = bankData.norek;
          accountOwner.value = bankData.pemilik;
          selectedNetwork.value = bankData.network;
          network_address.value = bankData.network_address;
        } else {
          console.error("Gagal mengambil data bank:", result.error);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data bank:", error);
      }
    };

    onMounted(async () => {
      if (!cardDataStore.userData) {
        await cardDataStore.fetchCardData();
      }

      await fetchData();
    });

    const selectNetwork = (network) => {
      selectedNetwork.value = network;
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const showAlert = (message, type) => {
      alert.value = { message, type };
      setTimeout(() => {
        alert.value.message = ""; // ✅ Alert otomatis hilang setelah 3 detik
      }, 3000);
    };

    const handleSubmit = async () => {
      if (paymentOption.value === "Bank") {
        if (
          !accountOwner.value ||
          !bankName.value ||
          !accountNumber.value ||
          !amount.value ||
          !password.value
        ) {
          showAlert("Harap isi semua kolom!", "error");
          return;
        }
      }

      if (paymentOption.value === "Wallet") {
        if (!network_address.value || !amount.value || !password.value) {
          showAlert("Harap isi semua kolom!", "error");
          return;
        }
      }

      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        showAlert("Token tidak ditemukan. Silakan login ulang.", "error");
        return;
      }

      isSubmitting.value = true;

      let formData = new FormData();
      formData.append("payment_method", paymentOption.value); // ✅ Tambahkan metode pembayaran
      formData.append("network", selectedNetwork.value);
      formData.append("network_address", network_address.value);
      formData.append("amount", amount.value);
      formData.append("password", password.value);

      if (paymentOption.value === "Bank") {
        formData.append("account_owner", accountOwner.value); // ✅ Tambahkan pemilik rekening
        formData.append("bank_name", bankName.value); // ✅ Tambahkan nama bank
        formData.append("account_number", accountNumber.value); // ✅ Tambahkan nomor rekening
      }

      try {
        let response = await fetch("https://tes.zshot-ai.com/api/withdraw", {
          method: "POST",
          headers: { Authorization: `Bearer ${jwtToken}` },
          body: formData,
        });

        let result = await response.json();

        if (response.ok) {
          showAlert("Withdraw berhasil!", "success");
        } else {
          let errorMessage = result.error || "Withdraw gagal!";
          showAlert(`Withdraw Gagal: ${errorMessage}`, "error");
        }
      } catch (error) {
        showAlert("Terjadi kesalahan server.", "error");
      }

      isSubmitting.value = false;
    };

    return {
      paymentOption,
      selectedNetwork,
      network_address,
      amount,
      password,
      showPassword,
      alert,
      isSubmitting,
      networkOptions,
      availableBalance,
      selectNetwork,
      togglePasswordVisibility,
      handleSubmit,
      fetchData,
      accountOwner, // ✅ Tambahkan ke return agar bisa digunakan di template
      bankName, // ✅ Tambahkan ke return agar bisa digunakan di template
      accountNumber, // ✅ Tambahkan ke return agar bisa digunakan di template
    };
  },
};
</script>
