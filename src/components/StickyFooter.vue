<template>
  <div
    class="relative flex justify-center items-center"
    style="bottom: 0; width: 100%; z-index: 10"
  >
    <footer
      class="bottom-0 left-0 w-full max-w-[450px] px-4 mb-4 bg-orange-600/30 dark:bg-orange-600/30 dark:shadow-lg"
    >
      <div
        class="flex justify-between items-center py-3 relative"
        style="height: 65px"
      >
        <router-link
          to="/dashboard"
          class="flex flex-col items-center text-3xl"
        >
          <img
            src="/assets/images/home-icon.png"
            width="30px"
            alt="Home"
            class="invert dark:invert-0"
          />
        </router-link>
        <router-link to="/trade" class="flex flex-col items-center text-3xl">
          <img
            src="/assets/images/dollar.png"
            width="20px"
            alt="Process"
            class="invert dark:invert-0"
          />
        </router-link>
        <router-link to="/support" class="flex flex-col items-center text-3xl">
          <img
            src="/assets/images/cs-icon.png"
            width="30px"
            alt="Profile"
            class="invert dark:invert-0"
          />
        </router-link>
        <router-link to="/wallet" class="flex flex-col items-center text-3xl">
          <img
            src="/assets/images/more.png"
            width="20px"
            alt="Profile"
            class="invert dark:invert-0"
          />
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "StickyFooter",
};
</script>

<style scoped>
/* Tambahkan gaya tambahan jika diperlukan */
</style>
