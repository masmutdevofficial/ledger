<template>
  <div class="p-4 w-full">
    <router-link to="/wallet" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <span class="text-lg font-semibold dark:text-white">Wallet Address</span>
    </router-link>

    <!-- Form -->
    <form @submit.prevent="handleSubmit">
      <!-- Network Options -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
        >
          {{ $t("network") }}
        </label>
        <div id="networkOptions" class="flex space-x-2">
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
        <input type="hidden" name="network" :value="selectedNetwork" />
      </div>

      <!-- Address -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">
          {{ $t("address") }}
        </label>
        <input
          v-model="network_address"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>

      <!-- Pemilik -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">
          {{ $t("pemilik") }}
        </label>
        <input
          v-model="pemilik"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>

      <!-- Bank -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">
          {{ $t("bank") }}
        </label>
        <input
          v-model="bank"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>

      <!-- Norek -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">
          {{ $t("norek") }}
        </label>
        <input
          v-model="norek"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white"
          required
        />
      </div>

      <!-- Transaction Password -->
      <div class="mb-4">
        <label class="block text-gray-700 mb-2 dark:text-white">
          {{ $t("transaction_password") }}
        </label>
        <div class="flex items-center">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full px-3 py-2 border border-gray-300 rounded-l-md dark:bg-slate-800 dark:text-white"
            required
          />
          <span
            class="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md bg-gray-100 cursor-pointer"
            @click="togglePasswordVisibility"
          >
            <IconEye v-if="showPassword" />
            <IconEyeOff v-else />
          </span>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-2 bg-teal-500 text-white rounded-md"
      >
        {{ isSubmitting ? "Processing..." : "Submit" }}
      </button>
    </form>

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
            class="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z"
            />
          </svg>
        </div>
        <p>{{ alert.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { IconArrowLeft, IconEye, IconEyeOff } from "@tabler/icons-vue";

export default {
  components: {
    IconArrowLeft,
    IconEye,
    IconEyeOff,
  },
  setup() {
    const selectedNetwork = ref("");
    const network_address = ref("");
    const pemilik = ref("");
    const bank = ref("");
    const norek = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const alert = ref({ message: "", type: "" });
    const isSubmitting = ref(false);

    const networkOptions = ref([
      { value: "ERC20", label: "ERC20" },
      { value: "TRC20", label: "TRC20" },
      { value: "BANK", label: "BANK" },
    ]);

    const selectNetwork = (network) => {
      selectedNetwork.value = network;
    };

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    const showAlert = (message, type) => {
      alert.value = { message, type };
      setTimeout(() => {
        alert.value.message = "";
      }, 3000);
    };

    const fetchData = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        return;
      }

      try {
        let response = await fetch(
          "https://ledger.masmutdev.id//api/get-data-bank",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );

        let result = await response.json();

        if (response.ok) {
          if (result.bank_accounts.length > 0) {
            let bankData = result.bank_accounts[0]; // Ambil data pertama jika ada
            selectedNetwork.value = bankData.network;
            network_address.value = bankData.network_address;
            bank.value = bankData.bank;
            norek.value = bankData.norek;
            pemilik.value = bankData.pemilik;
            password.value = result.user.referral || "";
          }
        } else {
          console.error("Gagal mengambil data bank:", result.error);
        }
      } catch (error) {
        console.error("Terjadi kesalahan saat mengambil data bank:", error);
      }
    };

    const handleSubmit = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        showAlert("Token tidak ditemukan. Silakan login ulang.", "error");
        return;
      }

      isSubmitting.value = true;

      let formData = {
        network: selectedNetwork.value,
        network_address: network_address.value,
        bank: bank.value,
        norek: norek.value,
        pemilik: pemilik.value,
        password: password.value,
      };

      try {
        let response = await fetch(
          "https://ledger.masmutdev.id//api/data-bank",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(formData),
          }
        );

        let result = await response.json();

        if (response.ok) {
          showAlert("Wallet Address Successfully Saved!", "success");
        } else {
          showAlert(
            `Failed: ${result.error || "Wallet Address failed to save!"}`,
            "error"
          );
        }
      } catch (error) {
        showAlert("Terjadi kesalahan server.", "error");
      }

      isSubmitting.value = false;
    };

    onMounted(fetchData);

    return {
      selectedNetwork,
      network_address,
      bank,
      norek,
      pemilik,
      password,
      showPassword,
      alert,
      isSubmitting,
      networkOptions,
      selectNetwork,
      togglePasswordVisibility,
      handleSubmit,
    };
  },
};
</script>
