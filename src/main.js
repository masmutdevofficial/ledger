import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import globalMixin from "./mixins/globalMixin";

import en from "./locales/en.json";
import id from "./locales/id.json";

const savedLanguage = localStorage.getItem("preferredLanguage") || "en";

const i18n = createI18n({
  legacy: false, // Pastikan Legacy API dinonaktifkan
  locale: savedLanguage, // Gunakan bahasa yang disimpan
  fallbackLocale: "en",
  messages: { en, id },
});

const app = createApp(App);
const head = createHead({
  title: "Ledger X", // Ganti dengan title default
  meta: [
    {
      name: "description",
      content:
        "Ledger X - More than Just dexchange Platform. Experience seamless trading and secure asset management",
    },
    { name: "keywords", content: "Ledger X" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Ledger X" },
    {
      name: "twitter:description",
      content:
        "Ledger X - More than Just dexchange Platform. Experience seamless trading and secure asset management",
    },
    {
      name: "twitter:image",
      content:
        "#https://ledger.masmutdev.id//storage/logos/IrOJ3MujUdXDW9L3AF1ATniIqs8qRPXflCojP8Vy.png",
    },
    { name: "twitter:site", content: "https://ledgerwallet.cloud" },
    { property: "og:title", content: "Ledger X" },
    {
      property: "og:description",
      content:
        "Ledger X - More than Just dexchange Platform. Experience seamless trading and secure asset management",
    },
    {
      property: "og:image",
      content:
        "https://ledger.masmutdev.id//storage/logos/IrOJ3MujUdXDW9L3AF1ATniIqs8qRPXflCojP8Vy.png",
    },
    { property: "og:url", content: "https://ledgerwallet.cloud" },
    { property: "og:type", content: "website" },
  ],
  link: [
    { rel: "canonical", href: "https://ledgerwallet.cloud" }, // Ganti dengan URL default
    {
      rel: "icon",
      type: "image/png",
      href: "https://ledger.masmutdev.id//storage/logos/IrOJ3MujUdXDW9L3AF1ATniIqs8qRPXflCojP8Vy.png",
    }, // Favicon
  ],
});

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(head);
app.use(i18n);
app.mixin(globalMixin);
app.mount("#app");
