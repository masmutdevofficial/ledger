<template>
  <div id="chart" class="w-full">
    <vue-apex-chart
      type="line"
      height="350"
      :options="chartOptions"
      :series="chartSeries"
    />
  </div>
</template>

<script>
import axios from "axios";
import VueApexCharts from "vue3-apexcharts";

export default {
  name: "CryptoDetailMarket",
  components: {
    VueApexChart: VueApexCharts,
  },
  props: {
    symbol: {
      type: String,
      required: true,
    },
    // Tambahkan properti period
    period: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartSeries: [],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          toolbar: { show: false },
          zoom: { enabled: true },
        },
        stroke: {
          width: [1, 1],
        },
        dataLabels: { enabled: false },
        tooltip: {
          enabled: true,
          shared: true,
          custom: function ({ seriesIndex, dataPointIndex, w }) {
            let ohlc = w.config.series[0].data[dataPointIndex].y;
            return `
              <div style="background: #fff; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                <span style="color: #ff0000;">Open:</span> ${ohlc[0]}<br>
                <span style="color: #00ff00;">High:</span> ${ohlc[1]}<br>
                <span style="color: #0000ff;">Low:</span> ${ohlc[2]}<br>
                <span style="color: #ff9900;">Close:</span> ${ohlc[3]}<br>
              </div>
            `;
          },
        },
        grid: {
          show: true,
          borderColor: "#e7e7e7",
          strokeDashArray: 0,
          xaxis: { lines: { show: true } },
          yaxis: {
            lines: { show: true },
          },
        },
        yaxis: {
          opposite: true,
        },
        xaxis: {
          type: "datetime",
          labels: {
            format: "HH:mm",
            datetimeUTC: false,
          },
        },
        legend: { show: false },
      },
    };
  },
  methods: {
    async fetchMarketData() {
      try {
        // Gunakan properti period untuk menentukan endpoint API
        const response = await axios.get(
          `https://ledger.masmutdev.id/api/crypto-data-candlestick/${this.symbol}/${this.period}`
        );
        console.log("API Response:", response.data);
        let data = response.data;
        if (!Array.isArray(data)) {
          console.error("Data bukan array:", data);
          return;
        }
        // Urutkan data dari terbaru ke lama
        data = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        const formattedCandlestick = data.map((item) => ({
          x: new Date(item.created_at),
          y: [
            parseFloat(parseFloat(item.open).toFixed(0)),
            parseFloat(parseFloat(item.low).toFixed(0)),
            parseFloat(parseFloat(item.high).toFixed(0)),
            parseFloat(parseFloat(item.close).toFixed(0)),
          ],
        }));
        const formattedLines = data.map((item) => ({
          x: new Date(item.created_at),
          y: item.close,
        }));
        this.chartSeries = [
          {
            name: "Candlestick",
            type: "candlestick",
            data: formattedCandlestick,
          },
          {
            name: "Close Price",
            type: "line",
            data: formattedLines,
            stroke: { colors: ["#0000FF"] },
          },
        ];
      } catch (error) {
        console.error("Gagal mengambil data market:", error);
      }
    },
  },
  mounted() {
    this.fetchMarketData();
  },
  watch: {
    // Ketika nilai period berubah, fetch data kembali
    period(newPeriod, oldPeriod) {
      if (newPeriod !== oldPeriod) {
        this.fetchMarketData();
      }
    },
    // Jika symbol juga berubah, refresh data
    symbol(newSymbol, oldSymbol) {
      if (newSymbol !== oldSymbol) {
        this.fetchMarketData();
      }
    },
  },
};
</script>
