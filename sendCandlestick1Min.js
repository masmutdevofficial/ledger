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

const periods = ["1min", "5min", "15min", "30min"];
const delayMs = 5000; // 5 detik antar periode

async function fetchCandlestickForPeriod(period) {
  console.log(`🔄 Mengambil data periode: ${period}`);
  const candleData = {};

  for (const symbol of allowedSymbols) {
    try {
      const res = await axios.get(
        "https://api.huobi.pro/market/history/kline",
        {
          params: { symbol, period, size: 1 },
        }
      );

      const [candle] = res.data.data;
      if (!candle) continue;

      candleData[symbol] = {
        open: candle.open,
        close: candle.close,
        low: candle.low,
        high: candle.high,
        amount: candle.amount,
        vol: candle.vol,
        period: period,
      };
    } catch (err) {
      const msg = err.response?.status || err.message;
      console.warn(`❌ Gagal ambil ${symbol} (${period}): ${msg}`);
    }
  }

  try {
    const postRes = await axios.post(
      "https://tes.zshot-ai.com/api/crypto-data-candlestick",
      {
        data: candleData,
      }
    );
    console.log(`✅ ${period} terkirim:`, postRes.data);
  } catch (err) {
    console.error(`❌ Gagal kirim ${period}:`, err.message);
  }
}

async function startAllPeriods() {
  for (const period of periods) {
    await fetchCandlestickForPeriod(period);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}

// Loop terus setiap X detik (misalnya setiap 1 menit)
setInterval(startAllPeriods, 60000); // Jalankan semua periode tiap 60 detik

// Jalankan pertama kali saat start
startAllPeriods();
