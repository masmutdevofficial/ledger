<template>
  <div class="p-4 w-full">
    <!-- Header -->
    <router-link to="/wallet" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <span class="text-lg font-semibold dark:text-white">Verification</span>
    </router-link>

    <!-- Status Verifikasi -->
    <div
      v-if="statusKTP !== null && ktpFile"
      class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md text-center"
    >
      <h2
        v-if="statusKTP === 0"
        class="text-lg font-semibold dark:text-white text-yellow-500"
      >
        Verification In Progress
      </h2>
      <h2
        v-if="statusKTP === 1"
        class="text-lg font-semibold dark:text-white text-green-500"
      >
        Verification Successfully
      </h2>
    </div>

    <!-- Form Upload KTP (Hanya Jika KTP Belum Ada) -->
    <div
      v-if="ktpFile === null && statusKTP === 0"
      class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <h2 class="text-lg font-semibold mb-2 dark:text-white">
        Upload KTP for Verification
      </h2>

      <!-- Preview Gambar -->
      <div v-if="imagePreview" class="mb-4">
        <img
          :src="imagePreview"
          alt="Preview KTP"
          class="w-full rounded-lg border shadow-sm"
        />
      </div>

      <!-- Input Upload -->
      <input
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        class="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white"
      />

      <!-- Tombol Upload -->
      <button
        @click="submitKTP"
        :disabled="isSubmitting"
        class="w-full mt-4 py-2 bg-teal-500 text-white rounded-md"
      >
        {{ isSubmitting ? "Uploading..." : "Submit" }}
      </button>
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
          @click="alert.message = ''"
          class="mt-4 px-4 py-2 bg-white text-black rounded"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { IconArrowLeft } from "@tabler/icons-vue";

export default {
  components: { IconArrowLeft },
  setup() {
    const selectedFile = ref(null);
    const imagePreview = ref(null);
    const alert = ref({ message: "", type: "" });
    const isSubmitting = ref(false);
    const statusKTP = ref(null);
    const ktpFile = ref(null);

    // Fungsi untuk mengecek status KTP
    const checkStatusKTP = async () => {
      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert.value = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      try {
        let response = await fetch(
          "https://ledger.masmutdev.id/api/status-ktp",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        let result = await response.json();

        if (response.ok) {
          statusKTP.value = result.status_ktp;
          ktpFile.value = result.ktp; // URL file KTP jika ada
        } else {
          alert.value = {
            message: "Gagal mengambil status KTP.",
            type: "error",
          };
        }
      } catch (error) {
        alert.value = { message: "Terjadi kesalahan server.", type: "error" };
      }
    };

    // Fungsi menangani perubahan file
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    // Fungsi kirim data ke API
    const submitKTP = async () => {
      if (!selectedFile.value) {
        alert.value = {
          message: "Harap pilih file terlebih dahulu!",
          type: "error",
        };
        return;
      }

      let jwtToken = localStorage.getItem("jwt_token");
      if (!jwtToken) {
        alert.value = {
          message: "Token tidak ditemukan. Silakan login ulang.",
          type: "error",
        };
        return;
      }

      isSubmitting.value = true;

      let formData = new FormData();
      formData.append("ktp", selectedFile.value);

      try {
        let response = await fetch(
          "https://ledger.masmutdev.id/api/verif-ktp",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${jwtToken}` },
            body: formData,
          }
        );

        let result = await response.json();

        if (response.ok) {
          alert.value = {
            message:
              "Upload KTP berhasil! Silahkan Tunggu Konfirmasi Dari Admin",
            type: "success",
          };
          checkStatusKTP(); // Perbarui status KTP setelah upload
        } else {
          alert.value = { message: `Gagal: ${result.error}`, type: "error" };
        }
      } catch (error) {
        alert.value = { message: "Terjadi kesalahan server.", type: "error" };
      }

      isSubmitting.value = false;
    };

    onMounted(() => {
      checkStatusKTP();
    });

    return {
      selectedFile,
      imagePreview,
      alert,
      isSubmitting,
      statusKTP,
      ktpFile,
      handleFileUpload,
      submitKTP,
    };
  },
};
</script>
