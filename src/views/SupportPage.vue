<template>
  <div
    class="min-h-screen w-full bg-white text-black dark:bg-gray-800 dark:text-white flex flex-col"
  >
    <!-- Header -->
    <header class="flex items-center px-4 py-3">
      <a href="/dashboard" class="text-black dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </a>
      <div class="flex-1 text-center">
        <p class="font-semibold text-black dark:text-white">
          Assistant Ledger X
        </p>
        <p class="text-xs text-black dark:text-white">Ask me anything</p>
      </div>
    </header>

    <!-- Chat Area -->
    <div class="flex-1 px-4 py-3 overflow-auto">
      <div v-if="messages.length > 0">
        <div v-for="message in messages" :key="message.id" class="mb-4">
          <div
            class="flex"
            :class="message.status === 0 ? 'items-end' : 'items-start'"
          >
            <div
              class="p-4 rounded-lg w-full flex flex-col"
              :class="
                message.status === 1
                  ? 'bg-green-200 text-black'
                  : 'bg-gray-300 dark:bg-gray-700 text-white'
              "
            >
              <!-- Pesan Utama -->
              <p>{{ message.pesan }}</p>
              <p class="text-xs opacity-75">{{ message.created_at }}</p>

              <!-- Gambar Pesan -->
              <img
                v-if="message.gambar"
                :src="message.gambar"
                class="w-24 h-24 rounded-lg mt-2"
                alt="Gambar pesan"
              />

              <!-- Tampilkan Balasan yang Sesuai -->
              <div v-if="message.balasan.length > 0" class="mt-2">
                <p class="font-semibold text-xs text-gray-500">Balasan:</p>
                <div
                  v-for="reply in message.balasan"
                  :key="reply.id"
                  class="ml-4 p-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
                >
                  <p class="text-sm">{{ reply.pesan }}</p>
                  <img
                    v-if="reply.gambar"
                    :src="reply.gambar"
                    class="w-16 h-16 rounded-lg mt-2"
                    alt="Gambar balasan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Jika Tidak Ada Pesan -->
      <div
        v-else
        class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg text-center"
      >
        <p class="text-black dark:text-white">
          Belum ada pesan. Kirim pesan pertama Anda!
        </p>
      </div>
    </div>

    <!-- Footer -->
    <footer class="dark:bg-gray-800 px-4 py-2 flex items-center relative">
      <!-- Floating Preview -->
      <div
        v-if="imagePreview"
        class="absolute bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md top-[-120px] left-0"
      >
        <img
          :src="imagePreview"
          alt="Preview"
          class="max-w-full max-h-24 rounded-lg"
        />
      </div>

      <!-- Upload Icon -->
      <label
        for="imageUpload"
        class="cursor-pointer text-yellow-400 flex items-center"
        :class="{ 'cursor-not-allowed opacity-50': imageUploaded }"
      >
        <IconPhotoUp stroke="2" class="w-6 h-6" />
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
        :disabled="imageUploaded"
      />

      <!-- Input Field -->
      <input
        type="text"
        v-model="message"
        placeholder="Ketik pesan..."
        class="flex-1 mx-4 px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-sm text-black dark:text-white focus:outline-none"
      />

      <!-- Send Button -->
      <button @click="sendMessage" :disabled="loading" class="text-yellow-400">
        <svg
          v-if="!loading"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 10l18-7-7 18-4-8-7-3z"
          />
        </svg>

        <span v-if="loading" class="text-xs">Mengirim...</span>
      </button>
    </footer>

    <!-- Modal Alert -->
    <div
      v-if="alert.message"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div
        class="p-4 rounded-lg flex flex-col justify-center items-center text-center w-[300px] bg-black/70 text-white"
      >
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
import { IconPhotoUp } from "@tabler/icons-vue";
import axios from "axios";

export default {
  components: {
    IconPhotoUp,
  },
  data() {
    return {
      message: "",
      messages: [],
      imageFile: null,
      imagePreview: null,
      imageUploaded: false,
      loading: false,
      alert: { message: "", type: "success" },
    };
  },
  mounted() {
    this.fetchMessages();
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);
        this.imageFile = file;
        this.imageUploaded = true;
      }
    },
    async fetchMessages() {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        this.alert = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      try {
        const response = await axios.get(
          "https://tes.zshot-ai.com/api/data-messages",
          {
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        console.log("Data yang diterima dari API:", response.data);

        if (response.data.pesan && Array.isArray(response.data.pesan)) {
          // Menambahkan balasan ke setiap pesan berdasarkan ID
          const messagesWithReplies = response.data.pesan.map((msg) => {
            return {
              ...msg,
              created_at: response.data.created_at,
              balasan:
                response.data.balasan.filter((reply) => reply.id === msg.id) ||
                [],
            };
          });

          this.messages = messagesWithReplies;
        } else {
          this.messages = [];
        }
      } catch (error) {
        console.error("Gagal mengambil pesan", error);
      }
    },
    async sendMessage() {
      if (!this.message.trim() && !this.imageFile) {
        this.alert = { message: "Pesan tidak boleh kosong!", type: "error" };
        return;
      }

      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        this.alert = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      let formData = new FormData();
      formData.append("pesan", this.message);
      formData.append("status", 0);
      if (this.imageFile) formData.append("gambar", this.imageFile);

      this.loading = true;
      try {
        const response = await axios.post(
          "https://tes.zshot-ai.com/api/messages",
          formData,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 201) {
          this.alert = { message: "Pesan berhasil dikirim!", type: "success" };
          this.fetchMessages(); // Ambil ulang pesan setelah mengirim
          this.message = "";
          this.imageFile = null;
          this.imagePreview = null;
          this.imageUploaded = false;
        }
      } catch (error) {
        this.alert = {
          message: "Gagal mengirim pesan. Coba lagi dengan isi pesan.",
          type: "error",
        };
      } finally {
        this.loading = false;
      }
    },
    closeAlert() {
      this.alert.message = "";
    },
  },
};
</script>
