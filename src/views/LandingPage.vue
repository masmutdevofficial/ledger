<template>
  <!-- Logo -->
  <div class="mt-16">
    <img src="@/assets/images/logo-icon.png" alt="Logo" class="w-32" />
  </div>

  <!-- Buttons -->
  <div class="flex flex-col items-center mt-12 space-y-4">
    <router-link
      to="/register"
      class="px-8 py-3 w-[250px] text-sm text-center bg-white text-black font-semibold rounded-full shadow-md hover:shadow-lg"
    >
      CREATE NEW WALLET
    </router-link>
    <router-link
      to="/login"
      class="px-8 py-3 w-[250px] text-sm text-center bg-white text-black font-semibold rounded-full shadow-md hover:shadow-lg"
    >
      I ALREADY HAVE A WALLET
    </router-link>
  </div>

  <!-- Description -->
  <div class="text-left mt-16 px-8">
    <h1 class="text-xl font-bold">More than</h1>
    <h2 class="text-2xl font-bold">Just Dexchange Platform</h2>
    <p class="text-gray-600 mt-4">
      Experience seamless trading and secure asset management
    </p>
  </div>
  <!-- Garis Pembatas -->
  <div class="w-80 border-t-[3px] border-gray-500 rounded-lg mt-8"></div>

  <div class="mt-8 mb-8">
    <router-link
      to="/login"
      class="flex items-center text-gray-800 font-semibold hover:text-blue-500 transition"
    >
      ENTER THE DEXWALLET
      <span
        class="ml-2 text-xl p-3 rounded-full bg-white w-10 h-10 flex justify-center items-center shadow-lg"
      >
        →
      </span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>
