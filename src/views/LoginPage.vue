<template>
  <!-- Logo -->
  <div class="mt-16">
    <img src="@/assets/images/logo-icon.png" alt="Logo" class="w-32" />
  </div>

  <!-- Form -->
  <div class="flex flex-col items-center mt-12 space-y-6 w-full">
    <!-- Field: Username -->
    <input
      v-model="username"
      type="text"
      placeholder="USERNAME"
      class="w-[250px] px-4 py-3 text-sm border border-gray-300 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
    />
    <!-- Field: Password -->
    <input
      v-model="password"
      type="password"
      placeholder="PASSWORD"
      class="w-[250px] px-4 py-3 text-sm border border-gray-300 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
    />

    <!-- Submit Button -->
    <button
      type="submit"
      class="px-8 py-3 w-[250px] text-sm bg-gradient-to-b from-gray-300 to-white text-black font-semibold rounded-full shadow-md hover:shadow-lg"
      @click="login"
    >
      LOGIN
    </button>
  </div>
  <!-- Modal -->
  <div
    v-if="alert.message"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div
      :class="[
        'p-4 rounded-lg flex flex-col justify-center items-center text-center w-[300px]',
        'bg-black/70 text-white',
      ]"
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
          class="icon icon-tabler icons-tabler-outline icon-tabler-xbox-x"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z"
          />
          <path d="M9 8l6 8" />
          <path d="M15 8l-6 8" />
        </svg>
      </div>

      <!-- Pesan Alert -->
      <p>{{ alert.message }}</p>
    </div>
  </div>

  <!-- Description -->
  <div class="text-left mt-16 px-8">
    <h1 class="text-xl font-bold">More than</h1>
    <h2 class="text-2xl font-bold">Just dexchange Platform</h2>
    <p class="text-gray-600 mt-4">
      Experience seamless trading and secure asset management
    </p>
  </div>

  <!-- Garis Pembatas -->
  <div class="w-80 border-t-[3px] border-gray-500 rounded-lg mt-8"></div>

  <!-- Footer Link -->
  <div class="mt-8 mb-8">
    <router-link
      to="/register"
      class="flex items-center justify-center text-gray-800 font-semibold"
    >
      CREATE NEW WALLET
      <span
        class="ml-2 text-xl p-3 rounded-full bg-white w-10 h-10 flex justify-center items-center"
        >→</span
      >
    </router-link>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      username: "",
      password: "",
      alert: {
        message: "",
        type: "", // 'success' atau 'error'
      },
    };
  },
  methods: {
    showAlert(message, type) {
      this.alert.message = message;
      this.alert.type = type;

      // Hilangkan alert setelah 3 detik
      setTimeout(() => {
        this.alert.message = "";
        this.alert.type = "";
      }, 3000);
    },
    async login() {
      if (!this.username || !this.password) {
        this.showAlert("Username and password cannot be empty.", "error");
        return;
      }

      try {
        const response = await axios.post(
          "https://ledger.masmutdev.id//api/login",
          {
            username: this.username,
            password: this.password,
          }
        );

        const token = response.data.token;
        if (token) {
          localStorage.setItem("jwt_token", token); // Simpan token JWT
          this.showAlert("Login successful!", "success");
          this.$router.push("/dashboard");
        } else {
          this.showAlert("Token not received. Login failed.", "error");
        }
      } catch (error) {
        this.showAlert(
          error.response?.data?.message || "Login failed. Please try again.",
          "error"
        );
      }
    },
  },
  mounted() {
    // Periksa state atau sessionStorage untuk alasan redirect
    const reason =
      this.$route.state?.redirectReason ||
      sessionStorage.getItem("redirectReason");

    if (reason === "auth_required") {
      this.showAlert("You must log in to access this page.", "error");
    } else if (reason === "session_expired") {
      this.showAlert("Session expired. Please log in again.", "error");
    }

    // Tangkap pesan logout dari query params
    const queryMessage = this.$route.query.message;
    const queryType = this.$route.query.type;

    if (queryMessage) {
      this.showAlert(queryMessage, queryType || "success");

      // Hapus query params setelah beberapa detik agar tidak muncul terus saat refresh
      setTimeout(() => {
        this.$router.replace({ path: "/login" }); // Menghapus query params tanpa refresh halaman
      }, 3000);
    }

    // Hapus alasan setelah ditampilkan
    sessionStorage.removeItem("redirectReason");
  },
};
</script>
