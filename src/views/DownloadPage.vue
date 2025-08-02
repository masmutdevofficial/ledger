<template>
  <div class="w-full">
    <!-- Header -->
    <router-link to="/wallet" class="flex items-center mb-4">
      <IconArrowLeft class="text-black dark:text-white me-2" />
      <span class="text-lg font-semibold dark:text-white">Download</span>
    </router-link>
    <div class="min-h-screen flex flex-col items-center">
      <!-- Header Section -->
      <div class="max-w-3xl text-center">
        <div class="relative mb-8">
          <img
            src="@/assets/images/new-bg-download.png"
            alt="Mockup Image"
            class="rounded-lg shadow-lg w-full"
          />
        </div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
          Ledger X - Official iOS Test Version
        </h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">
          With TestFlight, we can easily distribute the app to testers, collect
          feedback, and quickly resolve any issues that arise. TestFlight allows
          us to share the latest version of our app, ensuring that testers are
          testing with the most recent version.
        </p>
      </div>

      <!-- Download Buttons -->
      <div class="flex flex-col items-center gap-4 mt-8">
        <a
          href="#"
          class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-md w-72 text-center transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/e/ed/TestFlight_Icon.png/120px-TestFlight_Icon.png"
            alt="Apple Store Logo"
            class="w-6 h-6 mr-3"
          />
          TestFlight Download
        </a>
        <a
          href="#"
          class="flex items-center bg-gray-800 hover:bg-gray-900 text-white px-4 py-3 rounded-lg shadow-md w-72 text-center transition-all"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/505px-Apple_logo_grey.svg.png"
            alt="Apple Logo"
            class="w-6 h-7 mr-3"
          />
          AppleStore Download
        </a>
      </div>

      <!-- Footer -->
      <footer class="mt-10 text-center text-gray-600 dark:text-gray-400">
        <p>Ledger X for iPhone and iPad</p>
      </footer>
    </div>
  </div>
</template>

<script>
import { IconArrowLeft } from "@tabler/icons-vue";

export default {
  name: "DownloadPage",
  components: { IconArrowLeft },
};
</script>

<style scoped>
/* Tambahan styling jika dibutuhkan */
</style>
