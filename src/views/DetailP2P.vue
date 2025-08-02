<template>
  <div class="bg-transparent text-black dark:text-white font-sans min-h-screen">
    <div class="max-w-md mx-auto p-4">
      <div class="flex items-center mb-4">
        <IconArrowLeft
          class="text-xl cursor-pointer"
          @click="router.push('/p2p')"
        />
        <h1 class="text-xl font-bold mx-auto">BUY USDT</h1>
      </div>
      <p class="text-center text-gray-500 dark:text-white mb-4">
        Price Rp {{ formatPrice(price) }}
      </p>

      <div class="border rounded-lg p-4 mb-4">
        <div class="mb-4">
          <p class="text-gray-500 dark:text-white">Base on USD</p>
          <div class="flex items-center gap-2">
            <input
              v-model="usdAmount"
              type="number"
              min="0"
              step="0.01"
              class="text-4xl font-bold bg-transparent border-b border-gray-300 focus:outline-none focus:border-yellow-500 w-32"
              placeholder="0.00"
            />
            <span class="text-4xl font-bold text-yellow-500">USD</span>
          </div>
        </div>

        <div class="border-t border-b py-4 mb-4">
          <div class="flex justify-between mb-2">
            <p class="text-gray-500 dark:text-white">Price rate</p>
            <p class="font-bold">{{ formatPrice(price) }} IDR</p>
          </div>
          <div class="flex justify-between mb-2">
            <p class="text-gray-500 dark:text-white">You pay</p>
            <p class="font-bold">{{ formatPrice(youPay) }} IDR</p>
          </div>
          <div class="flex justify-between">
            <p class="text-gray-500 dark:text-white">You accept</p>
            <p class="font-bold">{{ formattedUsd }} USD</p>
          </div>
        </div>

        <div class="mb-4">
          <p class="text-gray-500 dark:text-white">Payment method</p>
          <p class="text-yellow-500 font-bold">Bank transfer</p>
        </div>

        <div class="mb-4">
          <div class="flex justify-between mb-2">
            <p class="text-gray-500 dark:text-white">Owner name</p>
            <p class="font-bold">{{ pemilik }}</p>
          </div>
          <div class="flex justify-between mb-2">
            <p class="text-gray-500 dark:text-white">Bank name</p>
            <p class="font-bold">{{ manualBank }}</p>
          </div>
          <div class="flex justify-between items-center">
            <p class="text-gray-500 dark:text-white">Account number</p>
            <div class="flex items-center">
              <IconCopy
                class="mr-2 w-4 h-4 cursor-pointer"
                @click="copyAccount"
              />
              <p class="font-bold">{{ norek }}</p>
            </div>
          </div>
        </div>

        <p class="text-center text-gray-500 dark:text-white mb-4">
          Payment verification within {{ formatTime(countdown) }} or order is
          cancelled
        </p>
      </div>

      <div class="flex flex-col justify-center mb-4">
        <!-- Upload Image -->
        <label
          class="block text-gray-700 text-center text-sm font-bold mb-2 dark:text-white"
        >
          Upload Image
        </label>
        <div
          class="flex items-center justify-center rounded cursor-pointer"
          @click="triggerFileInput"
        >
          <img
            :src="uploadedImage || 'https://placehold.co/400?text=UPLOAD+IMAGE'"
            alt="Upload image"
            class="w-20 h-20 object-cover"
          />
        </div>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          ref="imageInput"
          class="hidden"
          @change="previewImage"
        />
      </div>

      <button
        class="w-full bg-yellow-500 text-white py-2 rounded-full font-bold"
        @click="submitDeposit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Processing..." : "Already transfer" }}
      </button>
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
        @click="handleAlertClose"
        class="mt-4 px-4 py-2 bg-white text-black rounded"
      >
        OK
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IconArrowLeft, IconCopy } from "@tabler/icons-vue";

const route = useRoute(); // untuk baca param / query
const router = useRouter(); // untuk navigasi ke route lain
const price = ref(parseInt(route.query.price) || 0);
const minimumBuy = ref(parseInt(route.query.minimum_buy) || 0);
const imageInput = ref(null);
const usdAmount = ref(minimumBuy || 0);
const manualBank = ref("");
const norek = ref("");
const pemilik = ref("");
const uploadedImage = ref("");

const youPay = computed(() => {
  return Math.round(price.value * usdAmount.value);
});

const formattedUsd = computed(() => {
  const value = parseFloat(usdAmount.value);
  return isNaN(value) ? "0.00" : value.toFixed(2);
});

const alert = ref({ message: "", type: "" }); // Untuk feedback
const isSubmitting = ref(false);
const handleAlertClose = () => {
  const isSuccess = alert.value.type === "success";
  alert.value = { message: "", type: "" };
  if (isSuccess) {
    router.push("/notification");
  }
};
const submitDeposit = async () => {
  const jwtToken = localStorage.getItem("jwt_token");
  if (!jwtToken) {
    alert.value = { message: "Token tidak ditemukan!", type: "error" };
    return;
  }

  const file = imageInput.value?.files?.[0];
  if (!file) {
    alert.value = { message: "Silakan upload bukti transaksi!", type: "error" };
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert.value = { message: "Ukuran file maksimal 2MB", type: "error" };
    return;
  }

  const formData = new FormData();
  formData.append("via_bank", "P2P");
  formData.append("jumlah", youPay.value.toString());
  formData.append("bukti", file);
  formData.append("address", "-");

  isSubmitting.value = true;

  try {
    const response = await fetch("https://ledger.masmutdev.id/api/deposit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert.value = {
        message: "Berhasil dikirim! Order ID: " + result.order_id,
        type: "success",
      };
    } else {
      alert.value = {
        message: result.error || "Gagal mengirim deposit",
        type: "error",
      };
    }
  } catch (err) {
    alert.value = { message: "Terjadi kesalahan server!", type: "error" };
  } finally {
    isSubmitting.value = false;
  }
};

const countdown = ref(1800); // 30 menit = 1800 detik
let timer = null;

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
      // Optional: aksi kalau waktu habis
      alert("Waktu pembayaran habis!");
    }
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedImage.value = URL.createObjectURL(file);
  }
};

const fetchSettings = async () => {
  try {
    let response = await fetch("https://ledger.masmutdev.id/api/data-website");
    let result = await response.json();

    if (result.success) {
      manualBank.value = result.data.bank || "";
      norek.value = result.data.norek || "";
      pemilik.value = result.data.pemilik || "";
    }
  } catch (error) {
    console.error("Error fetching settings:", error);
  }
};

const formatPrice = (value) => {
  if (!value || isNaN(value)) return "0";
  return Number(value).toLocaleString("id-ID");
};

const copyAccount = () => {
  navigator.clipboard.writeText("1234567890123456");
  alert("Account number copied!");
};

const triggerFileInput = () => {
  imageInput.value?.click();
};

onMounted(() => {
  fetchSettings();
});
</script>
