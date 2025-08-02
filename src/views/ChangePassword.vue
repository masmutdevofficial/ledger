<template>
  <div class="p-4 w-full">
    <!-- Header -->
    <router-link to="/wallet" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <span class="text-lg font-semibold dark:text-white">Change Password</span>
    </router-link>

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

    <!-- Form Change Password -->
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto"
    >
      <h2 class="text-xl font-semibold mb-4 dark:text-white">
        Change Password
      </h2>

      <form @submit.prevent="handleSubmit">
        <!-- Old Password -->
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-white mb-1"
            >Old Password</label
          >
          <input
            v-model="oldPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <!-- New Password -->
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-white mb-1"
            >New Password</label
          >
          <input
            v-model="newPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-white mb-1"
            >Confirm New Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-2 bg-teal-500 text-white rounded-md"
        >
          {{ isSubmitting ? "Processing..." : "Change Password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { IconArrowLeft } from "@tabler/icons-vue";

export default {
  components: {
    IconArrowLeft,
  },
  setup() {
    const oldPassword = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const alert = ref({ message: "", type: "" });
    const isSubmitting = ref(false);

    const handleSubmit = async () => {
      // Validasi Input
      if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
        showAlert("All fields are required", "error");
        return;
      }
      if (newPassword.value.length < 3) {
        showAlert("New password must be at least 3 characters", "error");
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        showAlert("Confirm password does not match", "error");
        return;
      }

      // Ambil JWT Token dari LocalStorage
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        showAlert("Unauthorized, please login again", "error");
        return;
      }

      // Kirim data ke API
      isSubmitting.value = true;
      try {
        let response = await fetch(
          "https://ledger.masmutdev.id/api/change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
              old_password: oldPassword.value,
              new_password: newPassword.value,
              confirm_password: confirmPassword.value,
            }),
          }
        );

        let result = await response.json();

        if (response.ok) {
          showAlert("Password changed successfully!", "success");
        } else {
          let errorMessage = result.error || "Failed to change password";
          showAlert(errorMessage, "error");
        }
      } catch (error) {
        showAlert("Server error, please try again", "error");
      }

      isSubmitting.value = false;
    };

    // Fungsi untuk menampilkan modal alert
    const showAlert = (message, type) => {
      alert.value = { message, type };
      setTimeout(() => {
        alert.value.message = ""; // Menghilangkan alert setelah 3 detik
      }, 3000);
    };

    return {
      oldPassword,
      newPassword,
      confirmPassword,
      alert,
      isSubmitting,
      handleSubmit,
    };
  },
};
</script>
