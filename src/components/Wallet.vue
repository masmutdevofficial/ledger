<template>
  <div class="w-full" style="margin-bottom: 100px">
    <!-- Event -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center rounded-lg cursor-pointer mb-4"
      @click="openModal"
    >
      <span class="flex items-center dark:text-black">
        <IconSpeakerphone class="mr-2" />
        Event
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 w-full flex items-center justify-center bg-black bg-opacity-50 px-1"
      style="z-index: 10"
    >
      <div
        class="relative w-full max-w-[450px] bg-white/30 backdrop-blur-sm flex justify-center items-center rounded-lg shadow-lg"
      >
        <img :src="eventImage" class="w-full max-w-[450px] rounded-lg" />
        <div
          class="absolute p-2 bottom-[24px] left-[20px] bg-transparent"
          style="width: 100px; height: 40px"
          @click="claimEvent"
        ></div>
        <div class="absolute top-[-15px] right-0">
          <button
            @click="closeModal"
            class="px-1 py-1 bg-red-500 text-white rounded-full"
          >
            <IconX />
          </button>
        </div>
      </div>
    </div>
    <!-- Isi Data Bank -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/bank-account')"
    >
      <span class="flex items-center dark:text-black">
        <IconBuildingBank class="mr-2" />
        {{ $t("bank_account") }}
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Verifikasi -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/verification')"
    >
      <span class="flex items-center dark:text-black">
        <IconCheck class="mr-2" />
        {{ $t("verification") }}
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Ubah Password -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/change-password')"
    >
      <span class="flex items-center dark:text-black">
        <IconLock class="mr-2" />
        {{ $t("change_password") }}
      </span>
      <span class="text-white flex items-center dark:text-black">
        {{ $t("modify") }}
        <IconChevronRight class="ml-1 dark:text-black" />
      </span>
    </div>

    <!-- Download -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/download')"
    >
      <span class="flex items-center dark:text-black">
        <IconDownload class="mr-2" />
        Download
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Riwayat Transaksi -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/history')"
    >
      <span class="flex items-center dark:text-black">
        <IconHistory class="mr-2" />
        {{ $t("transaction_history") }}
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Pesan -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center mb-3 rounded-lg cursor-pointer"
      @click="$router.push('/support')"
    >
      <span class="flex items-center dark:text-black">
        <IconMessage class="mr-2" />
        {{ $t("message") }}
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Keluar -->
    <div
      class="bg-gray-400 text-white p-4 flex justify-between items-center rounded-lg cursor-pointer"
      @click="logout"
    >
      <span class="flex items-center dark:text-black">
        <IconLogout class="mr-2" />
        {{ $t("logout") }}
      </span>
      <IconChevronRight class="dark:text-black" />
    </div>

    <!-- Modal Alert -->
    <div
      v-if="alert.message"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="p-4 rounded-lg flex flex-col justify-center items-center text-center w-[300px] bg-black/70 text-white"
      >
        <!-- SVG Ikon -->
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

        <!-- Pesan Alert -->
        <p>{{ alert.message }}</p>
        <button
          @click="closeAlert"
          class="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCardDataStore } from "@/stores/cardData";
import {
  IconBuildingBank,
  IconCheck,
  IconLock,
  IconDownload,
  IconHistory,
  IconMessage,
  IconLogout,
  IconChevronRight,
  IconSpeakerphone,
  IconX,
} from "@tabler/icons-vue";

export default {
  name: "SettingsMenu",
  data() {
    return {
      alert: {
        message: "",
        type: "success",
      },
      isModalOpen: false, // ✅ Tambahkan properti ini untuk modal
      eventImage: "", // ✅ Tambahkan properti ini untuk gambar event
    };
  },
  components: {
    IconBuildingBank,
    IconCheck,
    IconLock,
    IconDownload,
    IconHistory,
    IconMessage,
    IconLogout,
    IconChevronRight,
    IconSpeakerphone,
    IconX,
  },
  methods: {
    setVerification() {
      localStorage.setItem("verif", "true");
      this.alert.message = "Verification successfully!";
      this.alert.type = "success";
    },
    async claimEvent() {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        this.alert = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      try {
        let response = await fetch("https://tes.zshot-ai.com/api/claim-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ token: jwtToken }), // Kirim sebagai JSON
        });

        let result = await response.json();

        if (result.success) {
          this.alert = {
            message: "Event berhasil diklaim!",
            type: "success",
          };
        } else {
          this.alert = {
            message: result.message || "Gagal mengklaim event.",
            type: "error",
          };
        }
      } catch (error) {
        console.error("Error claiming event:", error);
        this.alert = {
          message: "Terjadi kesalahan, coba lagi nanti.",
          type: "error",
        };
      }
    },
    logout() {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("verif");

      const cardDataStore = useCardDataStore();
      cardDataStore.$reset();

      this.alert.message = "Logout successfully!";
      this.alert.type = "success";

      setTimeout(() => {
        this.$router.push({
          path: "/login",
          query: { message: "Logout successfully", type: "success" },
        });
      }, 1500);
    },
    closeAlert() {
      this.alert.message = "";
    },
    async openModal() {
      this.isModalOpen = true;
      try {
        let response = await fetch("https://tes.zshot-ai.com/api/data-website");
        let result = await response.json();
        if (result.success) {
          this.eventImage =
            result.data.event_image || "https://placehold.co/400?text=EVENT";
        }
      } catch (error) {
        console.error("Error fetching event image:", error);
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
