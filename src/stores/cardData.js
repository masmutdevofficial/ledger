import { defineStore } from "pinia";
import axios from "axios";

export const useCardDataStore = defineStore("cardData", {
  state: () => ({
    userData: null, // Data pengguna dari API
    errorMessage: null, // Pesan error
  }),
  actions: {
    async fetchCardData() {
      if (this.userData) return; // Jika data sudah ada, tidak perlu fetch ulang

      const token = localStorage.getItem("jwt_token");
      if (!token) {
        this.errorMessage = "Session expired. Please log in again.";
        return;
      }

      try {
        const response = await axios.get(
          "https://ledger.masmutdev.id//api/card-data",
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          this.userData = response.data.data;
        } else {
          this.errorMessage = response.data.message || "Failed to load data.";
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Failed to fetch card data.";
      }
    },
  },
});
