<template>
  <div class="py-4 w-full">
    <div class="flex items-center justify-between mb-4">
      <router-link to="/deposit" class="flex items-center">
        <IconArrowLeft class="text-black dark:text-white me-2" />
      </router-link>
      <h1 class="text-xl dark:text-white">P2P EXPRESS</h1>
      <router-link to="/notification" class="flex items-center">
        <IconBellFilled class="text-black dark:text-white me-2" />
      </router-link>
    </div>
    <!-- Header -->
    <div class="border-t py-4">
      <div
        v-for="(exchanger, index) in exchangers"
        :key="index"
        class="flex justify-between items-center mb-4 border-b dark:text-white border-gray-300"
      >
        <div>
          <h2 class="flex flex-row text-lg dark:text-white">
            {{ exchanger.nama }}
            <img
              src="@/assets/images/verified.png"
              class="w-7 h-7 ml-2"
              alt=""
            />
          </h2>

          <p class="flex text-sm text-gray-600 dark:text-white">
            <span>Transaction {{ exchanger.transaction }}</span>
            <IconThumbUp class="w-5 h-5 ml-2" />
          </p>

          <p class="text-2xl mt-3">
            Rp {{ formatPrice(exchanger.harga) }} / USD
          </p>

          <p class="text-sm text-gray-600 dark:text-white">
            <span>Ready</span> {{ exchanger.stok }} USD
          </p>

          <p class="text-sm text-gray-600 dark:text-white mb-5">
            <span>Minimum buy</span> ${{ exchanger.minimum_buy }}
          </p>
        </div>

        <div class="text-right">
          <p class="text-yellow-500">Transfer bank</p>
          <button
            class="bg-green-600 text-white px-4 py-2 mt-2 rounded-full w-[100px]"
            @click="goToDetail(exchanger.harga, exchanger.minimum_buy)"
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { IconArrowLeft, IconBellFilled, IconThumbUp } from "@tabler/icons-vue";

const router = useRouter();
const exchangers = ref([]);
const loading = ref(false);
const alert = ref({ message: "", type: "" });

const fetchExchangers = async () => {
  const jwtToken = localStorage.getItem("jwt_token");
  if (!jwtToken) {
    alert.value = {
      message: "Token tidak ditemukan. Silakan login ulang.",
      type: "error",
    };
    return;
  }

  loading.value = true;

  try {
    const response = await fetch(
      "https://ledger.masmutdev.id//api/get-exchanger",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      exchangers.value = data.data || [];
    } else {
      alert.value = {
        message: data.message || "Gagal mengambil data exchanger",
        type: "error",
      };
    }
  } catch (error) {
    alert.value = {
      message: "Terjadi kesalahan saat mengambil data",
      type: "error",
    };
  } finally {
    loading.value = false;
  }
};

const goToDetail = (price, minimum_buy) => {
  router.push(`/detail-p2p?price=${price}&minimum_buy=${minimum_buy}`);
};

const formatPrice = (num) => {
  return num.toLocaleString("id-ID");
};

onMounted(() => {
  fetchExchangers();
});
</script>
