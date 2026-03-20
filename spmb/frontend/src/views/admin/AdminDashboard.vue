<template>
    <div class="p-6 bg-gray-50 dark:bg-darkbg min-h-screen transition-colors duration-300">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Dashboard SPMB</h1>
            <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Tahun Ajaran:</span>
                <select v-model="selectedYear" @change="fetchData" class="border border-gray-200 dark:border-gray-700 p-2 rounded bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                </select>
            </div>
        </div>

        <div v-if="isLoading" class="text-center py-20 text-gray-500">
            <i class="fas fa-spinner fa-spin text-4xl mb-4"></i>
            <p>Memuat data statistik...</p>
        </div>

        <div v-else>
            <!-- Top Section: Main Bar Chart and Summary Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <!-- Main Bar Chart -->
                <div class="lg:col-span-2 bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-4">Statistik Pendaftaran Tahunan</h3>
                    <VueApexCharts type="bar" height="300" :options="annualChartOptions" :series="annualChartSeries" />
                </div>
                <!-- Summary Cards -->
                <div class="flex flex-col gap-4">
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Pendaftar</p>
                            <h4 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ summary.total }}</h4>
                            <span class="text-[10px] text-gray-400 dark:text-gray-500">Tahun {{ selectedYear }}</span>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                            <i class="fas fa-users text-xl"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Terkonfirmasi</p>
                            <h4 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ summary.verified }}</h4>
                            <span class="text-[10px] text-gray-400 dark:text-gray-500">Tahun {{ selectedYear }}</span>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500">
                            <i class="fas fa-check-circle text-xl"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Diterima / Lulus</p>
                            <h4 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ summary.accepted }}</h4>
                            <span class="text-[10px] text-gray-400 dark:text-gray-500">Tahun {{ selectedYear }}</span>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                            <i class="fas fa-user-graduate text-xl"></i>
                        </div>
                    </div>
                    <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex items-center justify-between">
                        <div>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Ditolak</p>
                            <h4 class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ summary.rejected }}</h4>
                            <span class="text-[10px] text-gray-400 dark:text-gray-500">Tahun {{ selectedYear }}</span>
                        </div>
                        <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                            <i class="fas fa-times-circle text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Middle Section: Wave, Path, Gender Charts -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <!-- Gelombang -->
                <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-4">Statistik Gelombang</h3>
                    <VueApexCharts type="donut" height="250" :options="waveChartOptions" :series="waveChartSeries" />
                </div>
                <!-- Jalur -->
                <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-4">Statistik Jalur</h3>
                    <VueApexCharts type="bar" height="250" :options="pathChartOptions" :series="pathChartSeries" />
                </div>
                <!-- Gender -->
                <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                    <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-4">Statistik Jenis Kelamin</h3>
                    <VueApexCharts type="pie" height="250" :options="genderChartOptions" :series="genderChartSeries" />
                </div>
            </div>

            <!-- Bottom Section: Monthly Trend Line Chart -->
            <div class="bg-white dark:bg-darkcard rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 w-full">
                <h3 class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-4">Grafik Pendaftaran Masuk Sekolah (Januari - Desember)</h3>
                <VueApexCharts type="line" height="300" :options="monthlyChartOptions" :series="monthlyChartSeries" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../services/api';
import VueApexCharts from 'vue3-apexcharts';

const isLoading = ref(true);
const selectedYear = ref(new Date().getFullYear().toString());
const summary = ref({ total: 0, verified: 0, accepted: 0, rejected: 0 });

// -- Charts Data --
const getTheme = () => document.documentElement.classList.contains('dark') ? 'dark' : 'light';

const annualChartSeries = ref([]);
const annualChartOptions = ref({
    chart: { type: 'bar', toolbar: { show: false } },
    theme: { mode: getTheme() },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 6 } },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: { categories: [selectedYear.value] },
    fill: { opacity: 1 },
    colors: ['#7c3aed', '#06b6d4', '#22c55e', '#ef4444'],
    tooltip: { theme: getTheme() }
});

const waveChartSeries = ref([]);
const waveChartOptions = ref({
    chart: { type: 'donut' },
    theme: { mode: getTheme() },
    labels: [],
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    dataLabels: { enabled: false },
    tooltip: { theme: getTheme() }
});

const pathChartSeries = ref([]);
const pathChartOptions = ref({
    chart: { type: 'bar' },
    theme: { mode: getTheme() },
    plotOptions: { bar: { columnWidth: '45%', distributed: true, borderRadius: 4 } },
    xaxis: { categories: [] },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: { theme: getTheme() }
});

const genderChartSeries = ref([]);
const genderChartOptions = ref({
    chart: { type: 'pie' },
    theme: { mode: getTheme() },
    labels: ['Laki-Laki', 'Perempuan'],
    colors: ['#3b82f6', '#ec4899'],
    dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(1)}%` },
    tooltip: { theme: getTheme() }
});

const monthlyChartSeries = ref([{ name: 'Pendaftar', data: [] }]);
const monthlyChartOptions = ref({
    chart: { type: 'line', zoom: { enabled: false } },
    theme: { mode: getTheme() },
    dataLabels: { enabled: true },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'] },
    colors: ['#3b82f6'],
    tooltip: { theme: getTheme() }
});

const fetchData = async () => {
    isLoading.value = true;
    try {
        const res = await api.get(`/spmb/dashboard-stats?year=${selectedYear.value}`);
        if(res.data && res.data.success) {
            const d = res.data.data;
            summary.value = d.summary;

            // Update Annual Chart
            annualChartSeries.value = [
                { name: 'Pendaftar', data: [d.summary.total] },
                { name: 'Dikonfirmasi', data: [d.summary.verified] },
                { name: 'Diterima', data: [d.summary.accepted] },
                { name: 'Ditolak', data: [d.summary.rejected] }
            ];

            // Update Wave
            waveChartOptions.value = { ...waveChartOptions.value, labels: d.waveStats.map(w => w.label) };
            waveChartSeries.value = d.waveStats.map(w => w.value);
            
            if(waveChartSeries.value.length === 0) {
                 waveChartOptions.value.labels = ['Tidak ada data'];
                 waveChartSeries.value = [0];
            }

            // Update Path
            pathChartOptions.value = { ...pathChartOptions.value, xaxis: { categories: d.pathStats.map(p => p.label) } };
            pathChartSeries.value = [{ name: 'Pendaftar', data: d.pathStats.map(p => p.value) }];

            // Update Gender
            genderChartSeries.value = [d.genderStats['Laki-Laki'] || 0, d.genderStats['Perempuan'] || 0];

            // Update Monthly
            monthlyChartSeries.value = [{ name: 'Pendaftar', data: d.monthlyStats }];
        }
    } catch(e) {
        console.error('Failed to load dashboard stats:', e);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<style>
/* ApexCharts Premium Dark Mode Fixes */
.apexcharts-tooltip {
    transition: 0.15s ease all;
}

.dark .apexcharts-tooltip {
    background: #1e1e2d !important;
    border: 1px solid #2b2b40 !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
    color: #ffffff !important;
}

.dark .apexcharts-tooltip-title {
    background: #2b2b40 !important;
    border-bottom: 1px solid #374151 !important;
    color: #ffffff !important;
    font-weight: 700 !important;
}

.dark .apexcharts-tooltip-series-group {
    background: transparent !important;
}

.dark .apexcharts-tooltip-text {
    color: #ffffff !important;
}

.dark .apexcharts-text tspan {
    fill: #a1a1c1;
}

.dark .apexcharts-gridline {
    stroke: #2b2b40;
}

.dark .apexcharts-legend-text {
    color: #a1a1c1 !important;
}

/* Ensure no white on white */
.apexcharts-tooltip-text-label, 
.apexcharts-tooltip-text-value {
    color: inherit !important;
}
</style>
