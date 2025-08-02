<template>
  <div
    v-if="isReady"
    class="rounded-3xl w-full shadow-lg mb-4 bg-gradient-to-r from-gray-400 to-white dark:from-gray-800 dark:to-gray-300"
  >
    <div class="relative flex flex-col rounded-xl overflow-hidden">
      <!-- Background Layer -->
      <div class="absolute inset-0 z-0">
        <img
          src="@/assets/images/bg-card-soft.jpg"
          class="w-full h-[305px] object-cover opacity-90 dark:opacity-100 dark:brightness-50"
          alt="Background"
        />
      </div>

      <!-- Foreground Content -->
      <div class="relative z-10 px-4 pt-4">
        <!-- Header Section -->
        <div v-if="userData" class="flex flex-row justify-between items-center">
          <div class="flex flex-row items-center">
            <div class="flex flex-col">
              <div class="flex items-center">
                <p class="me-2 text-lg font-semibold dark:text-white">
                  {{ userData.user.username }}
                </p>
                <!-- Tampilkan ikon centang jika user terverifikasi -->
                <img
                  v-if="isVerified"
                  src="@/assets/images/check-icon.png"
                  class="w-4 mr-2"
                  alt="Verified"
                />
              </div>
            </div>
          </div>
          <div class="flex flex-row items-center">
            <img
              :src="themeIcon"
              class="w-5 me-3 cursor-pointer"
              :alt="themeAlt"
              @click="toggleTheme"
            />
            <img
              src="@/assets/images/internet.png"
              class="w-5 me-3 cursor-pointer"
              alt="Change Language"
              @click="toggleLanguage"
            />
            <a href="/notification" class="relative">
              <div
                v-if="userData.baca_deposit || userData.baca_withdraw"
                class="loader absolute"
              ></div>
              <img
                src="@/assets/images/bell-icon.png"
                class="w-5 me-3"
                alt="Notifications"
              />
            </a>
          </div>
        </div>

        <!-- Balance Section -->
        <div
          v-if="userData"
          class="mt-4 flex flex-row justify-between items-center"
        >
          <div class="flex flex-col justify-center items-center">
            <p class="text-xl font-semibold dark:text-white">
              {{ $t("total_balance") }}
            </p>
            <div class="flex justify-between items-center">
              <p class="text-3xl font-semibold dark:text-white">
                ${{ userData.info_user.saldo }}
              </p>
            </div>
          </div>
          <div class="flex flex-col justify-center items-center">
            <p class="dark:text-white">Credit Score</p>
            <p class="text-xl font-semibold dark:text-white">
              {{ userData.user.credit_score }}
            </p>
          </div>
        </div>

        <!-- Links Section -->
        <div
          v-if="userData"
          class="grid grid-cols-4 px-4 mb-4"
          style="position: relative; z-index: 4"
        >
          <router-link
            to="/history"
            class="flex flex-col justify-center items-center"
          >
            <img
              src="@/assets/images/history-icon.png"
              class="w-14"
              :class="applyFilter('/history')"
              alt="History"
            />
            <p class="text-sm font-semibold dark:text-white">
              {{ $t("history") }}
            </p>
          </router-link>
          <router-link
            to="/withdraw"
            class="flex flex-col justify-center items-center"
          >
            <img
              src="@/assets/images/minus-icon.png"
              class="w-14"
              :class="applyFilter('/withdraw')"
              alt="Withdraw"
            />
            <p class="text-sm font-semibold dark:text-white">
              {{ $t("withdraw") }}
            </p>
          </router-link>
          <router-link
            to="/deposit"
            class="flex flex-col justify-center items-center"
          >
            <img
              src="@/assets/images/plus-icon.png"
              class="w-14"
              :class="applyFilter('/deposit')"
              alt="Deposit"
            />
            <p class="text-sm font-semibold dark:text-white">
              {{ $t("deposit") }}
            </p>
          </router-link>
          <router-link
            to="/wallet"
            class="flex flex-col justify-center items-center"
          >
            <img
              src="@/assets/images/dollar-icon.png"
              class="w-14"
              :class="applyFilter('/wallet')"
              alt="Wallet"
            />
            <p class="text-sm font-semibold dark:text-white">
              {{ $t("wallet") }}
            </p>
          </router-link>
        </div>

        <!-- Error Message -->
        <div v-else class="text-white text-center mb-4">
          {{ errorMessage || "Loading data..." }}
        </div>
      </div>

      <!-- Modal Upload Avatar -->
      <div
        v-if="showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        style="z-index: 10000"
      >
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 class="text-lg font-semibold mb-4 dark:text-white">
            Upload Avatar
          </h2>
          <input type="file" @change="handleFileUpload" class="mb-4" />
          <div class="flex justify-end">
            <button
              @click="closeModal"
              class="bg-gray-400 px-4 py-2 rounded mr-2"
            >
              Batal
            </button>
            <button
              @click="uploadAvatar"
              :disabled="!selectedFile"
              class="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading Indicator -->
  <div v-else class="text-center text-gray-500 dark:text-gray-400">
    Loading...
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAppSettingsStore } from "@/stores/appSettings";
import { useCardDataStore } from "@/stores/cardData";

export default {
  name: "CardAbove",
  setup() {
    const { t, locale } = useI18n();
    const appSettings = useAppSettingsStore();
    const route = useRoute();
    const cardDataStore = useCardDataStore();
    const showModal = ref(false);
    const selectedFile = ref(null);

    const toggleTheme = appSettings.toggleTheme;
    const isReady = ref(false);
    const isVerified = ref(false); // Simpan status verifikasi

    const toggleLanguage = () => {
      appSettings.toggleLanguage((newLocale) => {
        locale.value = newLocale;
      });
    };

    const themeIcon = computed(() =>
      appSettings.isDarkMode
        ? new URL("@/assets/images/night-mode.png", import.meta.url).href
        : new URL("@/assets/images/light-mode.png", import.meta.url).href
    );

    const themeAlt = computed(() =>
      appSettings.isDarkMode ? "Dark Mode" : "Light Mode"
    );

    const userData = computed(() => cardDataStore.userData);
    const errorMessage = computed(() => cardDataStore.errorMessage);

    const userAvatar = computed(() =>
      userData.value?.user?.avatar
        ? `https://ledger.masmutdev.id//storage/${userData.value.user.avatar.replace(
            /\\/g,
            "/"
          )}`
        : "/assets/images/avatar.avif"
    );

    const handleFileUpload = (event) => {
      selectedFile.value = event.target.files[0]; // Simpan file yang dipilih
    };

    // ** Fungsi untuk membuka modal **
    const openModal = () => {
      showModal.value = true;
    };

    // ** Fungsi untuk menutup modal **
    const closeModal = () => {
      showModal.value = false;
      selectedFile.value = null;
    };

    const uploadAvatar = async () => {
      if (!selectedFile.value) {
        alert("Pilih file terlebih dahulu!");
        return;
      }

      // Ambil token dari localStorage
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert("Token tidak ditemukan. Silakan login ulang.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("avatar", selectedFile.value);

        const response = await fetch(
          "https://ledger.masmutdev.id//api/send-avatar",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            body: formData,
          }
        );

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          alert("Avatar berhasil diunggah!");
          userData.value.user.avatar = responseData.avatar_url; // Perbarui avatar setelah upload berhasil
          closeModal();
        } else {
          alert(responseData.message || "Gagal mengunggah avatar.");
        }
      } catch (error) {
        console.error("Error uploading avatar:", error);
        alert("Terjadi kesalahan saat mengunggah avatar.");
      }
    };

    const applyFilter = (path) => {
      return route.path === path
        ? "opacity-100 brightness-0"
        : "opacity-100 brightness-100";
    };

    const setVerification = () => {
      localStorage.setItem("verif", "true");
      isVerified.value = true;
      alert("Verification status saved!");
    };

    onMounted(async () => {
      if (!userData.value) {
        await cardDataStore.fetchCardData();
      }
      isReady.value = true;
      isVerified.value = localStorage.getItem("verif") === "true"; // Cek status verifikasi saat komponen dimuat
    });

    return {
      t,
      userAvatar,
      openModal,
      uploadAvatar,
      closeModal,
      toggleTheme,
      toggleLanguage,
      themeIcon,
      themeAlt,
      applyFilter,
      userData,
      errorMessage,
      isReady,
      isVerified,
      setVerification,
      showModal, // Pastikan ini dikembalikan
      selectedFile,
      handleFileUpload,
    };
  },
};
</script>

<style scoped>
/* Gaya untuk filter jika diterapkan */
.filter.grayscale {
  filter: grayscale(0) brightness(1);
}
.loader {
  width: 7px; /* Ukuran lingkaran */
  aspect-ratio: 1; /* Pastikan tetap proporsional */
  border-radius: 50%; /* Bulat sempurna */
  background: #fd3838; /* Warna lingkaran */
  box-shadow: 0 0 0 0 rgba(245, 146, 146, 0.4); /* Bayangan awal */
  animation: l1 1.5s infinite ease-out;
}

@keyframes l1 {
  100% {
    box-shadow: 0 0 20px 20px rgba(245, 146, 146, 0); /* Efek fade out tetap bulat */
  }
}
</style>
