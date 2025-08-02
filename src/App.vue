<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAppSettingsStore } from "@/stores/appSettings";

const appSettings = useAppSettingsStore();
const route = useRoute();

// Tentukan kelas latar belakang berdasarkan rute saat ini
const containerClass = computed(() => {
  const whiteBgRoutes = ["/", "/login", "/register"];
  return whiteBgRoutes.includes(route.path)
    ? "bg-gradient-to-r from-gray-300 to-white flex flex-col items-center w-full max-w-[450px] min-h-screen shadow-lg p-4"
    : "bg-white dark:bg-slate-800 flex flex-col items-center w-screen max-w-[450px] min-h-screen shadow-lg p-4";
});

// Terapkan tema saat komponen di-mount
if (appSettings.isDarkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}
</script>

<template>
  <div :class="containerClass">
    <RouterView />
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
