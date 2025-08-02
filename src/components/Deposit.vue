<template>
  <div class="w-full mt-4" style="margin-bottom: 100px">
    <!-- QR Code (Hanya jika network bukan BANK) -->
    <div v-if="selectedNetwork !== 'BANK'" class="flex justify-center mb-4">
      <img
        alt="QR code for deposit address"
        class="w-32 h-32"
        :src="usdtQr || 'https://placehold.co/400?text=QR'"
      />
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Nomor Rekening (Hanya jika memilih BANK) -->
      <div v-if="selectedNetwork === 'BANK'" class="mb-4">
        <div class="flex items-center border border-gray-300 rounded p-2">
          <input
            v-model="pemilik"
            class="flex-grow p-2 outline-none placeholder:text-black dark:bg-slate-800 dark:placeholder:text-white dark:text-white"
            placeholder="Nama"
            type="text"
            readonly
            required
          />
        </div>
      </div>

      <!-- Address / Bank Information -->
      <div class="mb-4">
        <div
          class="flex items-center border border-gray-300 rounded p-2 w-full"
        >
          <span class="text-black mr-4 dark:text-white">
            {{ selectedNetwork === "BANK" ? "Bank" : $t("address") }}
          </span>
          <input
            v-if="selectedNetwork !== 'BANK'"
            v-model="address"
            class="flex-grow p-2 outline-none placeholder:text-black dark:bg-slate-800 dark:placeholder:text-white dark:text-white"
            :placeholder="$t('placeholder_deposit_address')"
            type="text"
            required
            readonly
          />
          <input
            v-else
            v-model="manualBank"
            class="flex-grow p-2 outline-none placeholder:text-black dark:bg-slate-800 dark:placeholder:text-white dark:text-white"
            placeholder="Nama Bank"
            type="text"
            readonly
          />
          <button
            type="button"
            class="ml-2 text-teal-500 text-2xl"
            title="Copy Address"
            @click="copyAddress"
          >
            <IconCopy />
          </button>
        </div>
      </div>

      <!-- Nomor Rekening (Hanya jika memilih BANK) -->
      <div v-if="selectedNetwork === 'BANK'" class="mb-4">
        <div class="flex items-center border border-gray-300 rounded p-2">
          <input
            v-model="norek"
            class="flex-grow p-2 outline-none placeholder:text-black dark:bg-slate-800 dark:placeholder:text-white dark:text-white"
            placeholder="Nomor Rekening"
            type="text"
            readonly
            required
          />
        </div>
      </div>

      <!-- Deposit Amount -->
      <div class="mb-4">
        <div class="flex items-center border border-gray-300 rounded p-2">
          <input
            v-model.number="depositAmount"
            class="flex-grow p-2 outline-none placeholder:text-black dark:bg-slate-800 dark:placeholder:text-white dark:text-white"
            :placeholder="$t('placeholder_deposit_amount')"
            type="number"
            min="1"
            required
          />
          <span class="text-black dark:text-white">USDT</span>
        </div>
      </div>

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

      <!-- Upload Image -->
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
        >
          {{ $t("upload_image") }}
        </label>
        <div
          class="flex items-center justify-center border border-gray-300 rounded p-4 cursor-pointer"
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

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full py-2 bg-teal-500 text-white rounded-md"
      >
        Submit
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
import { IconCopy } from "@tabler/icons-vue";

export default {
  name: "DepositForm",
  components: {
    IconCopy,
  },
  data() {
    return {
      address: "", // Menyimpan USDT wallet
      usdtQr: "", // Menyimpan URL QR code
      depositAmount: "",
      selectedNetwork: "ERC20",
      manualBank: "", // Menyimpan nama bank jika network BANK
      norek: "", // Menyimpan nomor rekening jika network BANK
      pemilik: "", // Menyimpan nomor rekening jika network BANK
      networkOptions: [
        { value: "TRC20", label: "TRC20" },
        { value: "P2P", label: "P2P" },
      ],
      uploadedImage: null,
      alert: { message: "", type: "" },
    };
  },
  mounted() {
    this.fetchSettings();
  },
  methods: {
    async fetchSettings() {
      try {
        let response = await fetch("https://tes.zshot-ai.com/api/data-website");
        let result = await response.json();

        if (result.success) {
          this.address = result.data.usdt_wallet || "";
          this.usdtQr =
            result.data.usdt_qr || "https://placehold.co/400?text=QR";
          this.manualBank = result.data.bank || "";
          this.norek = result.data.norek || "";
          this.pemilik = result.data.pemilik || "";
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    },

    selectNetwork(network) {
      this.selectedNetwork = network;
      if (network === "P2P") {
        this.$router.push("/p2p");
      }
    },

    triggerFileInput() {
      this.$refs.imageInput.click();
    },

    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = URL.createObjectURL(file);
      }
    },

    async handleSubmit() {
      if (!this.address.trim()) {
        this.alert = {
          message: "Harap masukkan address sebelum mengirim!",
          type: "error",
        };
        return;
      }

      if (!this.depositAmount || this.depositAmount <= 0) {
        this.alert = {
          message: "Masukkan jumlah deposit yang valid!",
          type: "error",
        };
        return;
      }

      if (!this.$refs.imageInput.files[0]) {
        this.alert = {
          message: "Harap unggah bukti transaksi sebelum mengirimkan!",
          type: "error",
        };
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
      formData.append("address", this.address); // Kirimkan address
      formData.append("via_bank", this.selectedNetwork);
      formData.append("jumlah", this.depositAmount);
      formData.append("bukti", this.$refs.imageInput.files[0]);

      if (this.selectedNetwork === "BANK") {
        formData.append("bank", this.manualBank);
        formData.append("norek", this.norek);
      } else {
        formData.append("address", this.address);
      }

      try {
        let response = await fetch("https://tes.zshot-ai.com/api/deposit", {
          method: "POST",
          headers: { Authorization: `Bearer ${jwtToken}` },
          body: formData,
        });

        let result = await response.json();

        if (response.ok) {
          this.alert = {
            message: "Transaksi berhasil dengan Deposit ID: " + result.order_id,
            type: "success",
          };
        } else {
          this.alert = {
            message: "Terjadi kesalahan: " + result.error,
            type: "error",
          };
        }
      } catch (error) {
        this.alert = {
          message: "Gagal mengirim transaksi. Coba lagi nanti.",
          type: "error",
        };
      }
    },
    copyAddress() {
      let textToCopy =
        this.selectedNetwork === "BANK" ? `${this.norek}` : this.address;

      navigator.clipboard.writeText(textToCopy).then(() => {
        this.alert = {
          message:
            this.selectedNetwork === "BANK"
              ? "Nomor rekening berhasil disalin!"
              : "Address copied to clipboard!",
          type: "success",
        };
      });
    },
  },
};
</script>
