import { createRouter, createWebHistory } from "vue-router";
import { jwtDecode } from "jwt-decode";

import LandingPage from "@/views/LandingPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import RegisterPage from "@/views/RegisterPage.vue";
import DashboardPage from "@/views/DashboardPage.vue";
import CryptoDetail from "@/views/CryptoDetail.vue";
import SupportPage from "@/views/SupportPage.vue";
import HistoryPage from "@/views/HistoryPage.vue";
import DepositPage from "@/views/DepositPage.vue";
import WalletPage from "@/views/WalletPage.vue";
import WithdrawPage from "@/views/WithdrawPage.vue";
import DownloadPage from "@/views/DownloadPage.vue";
import Transaction from "@/views/Transaction.vue";
import VerificationPage from "@/views/VerificationPage.vue";
import BankAccount from "@/views/BankAccount.vue";
import NotificationPage from "@/views/NotificationPage.vue";
import ChangePassword from "@/views/ChangePassword.vue";
import MainIcon from "@/views/MainIcon.vue";
import P2P from "@/views/P2P.vue";
import DetailP2P from "@/views/DetailP2P.vue";

// Definisikan route
const routes = [
  {
    path: "/",
    name: "landing",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/market/:symbol",
    name: "cryptoDetail",
    component: CryptoDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/support",
    name: "support",
    component: SupportPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    name: "history",
    component: HistoryPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/deposit",
    name: "deposit",
    component: DepositPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/p2p",
    name: "p2p",
    component: P2P,
    meta: { requiresAuth: true },
  },
  {
    path: "/detail-p2p",
    name: "detail-p2p",
    component: DetailP2P,
    meta: { requiresAuth: true },
  },
  {
    path: "/wallet",
    name: "wallet",
    component: WalletPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/withdraw",
    name: "withdraw",
    component: WithdrawPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/download",
    name: "download",
    component: DownloadPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/bank-account",
    name: "bank-account",
    component: BankAccount,
    meta: { requiresAuth: true },
  },
  {
    path: "/verification",
    name: "verification",
    component: VerificationPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/notification",
    name: "notification",
    component: NotificationPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: { requiresAuth: true },
  },
  {
    path: "/trade",
    name: "trade",
    component: MainIcon,
    meta: { requiresAuth: true },
  },
  {
    path: "/buy/:symbol",
    name: "buy",
    props: true,
    component: Transaction,
    meta: { requiresAuth: true },
  },
  {
    path: "/sell/:symbol",
    name: "sell",
    props: true,
    component: Transaction,
    meta: { requiresAuth: true },
  },
];

// Buat router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("jwt_token");

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        // Token expired, hapus dan redirect ke login
        localStorage.removeItem("jwt_token");
        sessionStorage.setItem("redirectReason", "session_expired");
        next({ name: "login" });
        return;
      }

      // Jika pengguna sudah login dan mencoba akses halaman public, arahkan ke dashboard
      if (["landing", "login", "register"].includes(to.name)) {
        next({ name: "dashboard" });
        return;
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("jwt_token");
      sessionStorage.setItem("redirectReason", "session_expired");
      next({ name: "login" });
      return;
    }
  }

  // Cek jika halaman butuh autentikasi tetapi user belum login
  if (to.meta.requiresAuth && !token) {
    sessionStorage.setItem("redirectReason", "auth_required");
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
