import { defineStore } from "pinia";

export const useAppSettingsStore = defineStore("appSettings", {
  state: () => ({
    isDarkMode: localStorage.getItem("theme") === "dark",
    language: localStorage.getItem("preferredLanguage") || "en",
  }),
  actions: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      const html = document.documentElement;
      if (this.isDarkMode) {
        html.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        html.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    },
    toggleLanguage(updateLocale) {
      this.language = this.language === "en" ? "id" : "en";
      updateLocale(this.language); // Perbarui locale di i18n
      localStorage.setItem("preferredLanguage", this.language);
    },
  },
});
