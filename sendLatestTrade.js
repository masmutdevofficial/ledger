const axios = require("axios");

const allowedSymbols = [
  "btcusdt",
  "ethusdt",
  "solusdt",
  "tronbullusdt",
  "xrpusdt",
  "suiusdt",
  "tonusdt",
  "polusdt",
  "galausdt",
  "adausdt",
  "dogeusdt",
  "linkusdt",
  "qtumusdt",
  "ltcusdt",
  "radusdt",
  "thetausdt",
  "algousdt",
  "bandusdt",
  "bnbusdt",
  "lunausdt",
  "pepeusdt",
];

async function fetchAndSendLatestTrade() {
  let allTrades = [];

  for (const symbol of allowedSymbols) {
    try {
      const response = await axios.get(
        "https://api.huobi.pro/market/history/trade",
        {
          params: { symbol, size: 1 },
        }
      );

      const trades = response.data.data;
      if (!trades || !trades.length) continue;

      for (const trade of trades) {
        for (const detail of trade.data) {
          allTrades.push({
            symbol,
            direction: detail.direction,
            price: detail.price,
            amount: detail.amount,
            date: new Date(detail.ts).toISOString(),
          });
        }
      }
    } catch (error) {
      const status = error.response?.status || "NO_RESPONSE";
      console.warn(`❌ Symbol "${symbol}" gagal diambil (status: ${status}).`);
      continue;
    }
  }

  if (allTrades.length > 0) {
    try {
      console.log(
        "📦 Data yang akan dikirim:",
        JSON.stringify(allTrades, null, 2)
      );
      const postRes = await axios.post(
        "https://ledger.masmutdev.id/api/latest-trade",
        {
          data: allTrades,
        }
      );
      console.log("✅ Trade data berhasil dikirim:", postRes.data);
    } catch (err) {
      console.error("❌ Gagal kirim ke Laravel endpoint:", err.message);
    }
  } else {
    console.warn("⚠️ Tidak ada data trade valid yang bisa dikirim.");
  }
}

// Jalankan setiap 5 detik
setInterval(fetchAndSendLatestTrade, 60000);

// Jalankan langsung saat start
fetchAndSendLatestTrade();
