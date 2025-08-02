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

async function fetchAndSendData() {
  try {
    const huobiResponse = await axios.get(
      "https://api.huobi.pro/market/tickers"
    );

    if (huobiResponse.data.status !== "ok") {
      throw new Error("Gagal mengambil data dari HTX");
    }

    const allTickers = huobiResponse.data.data;
    const filteredData = {};

    for (const item of allTickers) {
      if (allowedSymbols.includes(item.symbol)) {
        filteredData[item.symbol] = {
          symbol: item.symbol,
          open: item.open,
          close: item.close,
          low: item.low,
          high: item.high,
          amount: item.amount,
          vol: item.vol,
          timestamp: item.ts || Date.now(),
        };
      }
    }

    const postResponse = await axios.post(
      "https://ledger.masmutdev.id/api/crypto-data-detail",
      { data: filteredData }
    );

    console.log("✅ Data berhasil dikirim:", postResponse.data);
  } catch (error) {
    console.error("❌ Terjadi kesalahan:", error.message);
  }
}

// Jalankan langsung saat start
fetchAndSendData();

// Jalankan setiap 5 detik
setInterval(fetchAndSendData, 60000);
