document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://darshan-sahay-1.onrender.com/api/dashboard_data';


    const todayPredictionEl = document.getElementById('today-prediction');
    const hourlyChartEl = document.getElementById('hourly-chart');
    const heatmapContainerEl = document.getElementById('heatmap-container');
    const emergencyListEl = document.getElementById('emergency-list');
    const waterBarEl = document.getElementById('water-bar');
    const waterPercentEl = document.getElementById('water-percent');
    const toiletBarEl = document.getElementById('toilet-bar');
    const toiletPercentEl = document.getElementById('toilet-percent');
    const staffCountEl = document.getElementById('staff-count');
    const trafficMainEl = document.getElementById('traffic-main');
    const trafficParkingEl = document.getElementById('traffic-parking');
    const trafficShuttleEl = document.getElementById('traffic-shuttle');
    const lastUpdatedEl = document.getElementById('last-updated');

    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            updateDashboard(data);
        } catch (err) { console.error(err); }
    }

    function updateDashboard(data) {
        todayPredictionEl.textContent = data.crowdPrediction.today.toLocaleString();
        renderHourlyChart(data.crowdPrediction.hourly);
        renderHeatmap(data.heatmapData);
        renderEmergencyAlerts(data.emergencyAlerts);
        updateResources(data.resources);
        updateTraffic(data.trafficStatus);
        lastUpdatedEl.textContent = new Date().toLocaleTimeString();
    }

    function renderHourlyChart(hourlyData) {
        hourlyChartEl.innerHTML = '';
        const values = Object.values(hourlyData);
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        for (const [hour, value] of Object.entries(hourlyData)) {
            const height = (value / maxVal) * 100;
            let barColor = 'bg-green-500';
            if (value > minVal + (maxVal - minVal) * 0.75) barColor = 'bg-red-500';
            else if (value > minVal + (maxVal - minVal) * 0.5) barColor = 'bg-orange-500';
            else if (value > minVal + (maxVal - minVal) * 0.25) barColor = 'bg-yellow-500';

            const barHtml = `
                <div class="relative w-full flex-grow flex flex-col justify-end items-center group">
                    <div class="w-full rounded-t-full ${barColor}" style="height: ${height}%;"></div>
                    <span class="text-xs text-gray-400 mt-2">${hour.split(':')[0]}</span>
                    <div class="absolute bottom-full mb-2 p-1 rounded-md bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100">${value.toLocaleString()} visitors</div>
                </div>
            `;
            hourlyChartEl.innerHTML += barHtml;
        }
    }

    function renderHeatmap(heatmapData) {
        heatmapContainerEl.innerHTML = '';
        heatmapData.forEach(cell => {
            const div = document.createElement('div');
            div.className = `heatmap-cell density-${cell.density}`;
            heatmapContainerEl.appendChild(div);
        });
    }

    function renderEmergencyAlerts(alerts) {
        if (alerts.length === 0) {
            emergencyListEl.innerHTML = `<div class="text-center text-gray-500">No alerts to display.</div>`;
            return;
        }
        emergencyListEl.innerHTML = '';
        alerts.forEach(alert => {
            let statusColor = 'text-green-400';
            if (alert.status === 'New') statusColor = 'text-red-400';
            else if (alert.status === 'Dispatched') statusColor = 'text-yellow-400';

            const alertHtml = `
                <div class="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <p class="font-bold text-white">${alert.type}</p>
                        <p class="text-sm text-gray-400">${alert.location} - <span class="${statusColor}">${alert.status}</span></p>
                    </div>
                    <span class="text-sm text-gray-500">${alert.timestamp}</span>
                </div>
            `;
            emergencyListEl.innerHTML += alertHtml;
        });
    }

    function updateResources(resources) {
        waterBarEl.style.width = `${resources.water_level}%`;
        waterPercentEl.textContent = `${resources.water_level}%`;
        toiletBarEl.style.width = `${resources.toilet_availability}%`;
        toiletPercentEl.textContent = `${resources.toilet_availability}%`;
        staffCountEl.textContent = resources.staff_on_duty.toLocaleString();
    }

    function updateTraffic(traffic) {
        trafficMainEl.textContent = traffic.main_entrance;
        trafficParkingEl.textContent = traffic.parking_lot_A;
        trafficShuttleEl.textContent = traffic.shuttle_services;
        trafficMainEl.className = `text-2xl font-bold mt-1 ${getTrafficColor(traffic.main_entrance)}`;
        trafficParkingEl.className = `text-2xl font-bold mt-1 ${getTrafficColor(traffic.parking_lot_A)}`;
    }

    function getTrafficColor(status) {
        switch (status) {
            case "Low Flow": case "Empty": return "text-green-400";
            case "Medium Flow": case "Half Full": return "text-yellow-400";
            case "High Flow": case "Almost Full": return "text-orange-400";
            case "Congested": return "text-red-400";
            default: return "text-gray-400";
        }
    }

    fetchData();
    setInterval(fetchData, 5000);

    document.getElementById('trigger-alert-btn').addEventListener('click', () => {
        const newAlert = {
            type: "Test Alert",
            location: "Triggered Manually",
            status: "New",
            timestamp: new Date().toLocaleTimeString()
        };
        const alertEl = document.createElement('div');
        alertEl.className = 'bg-gray-800 p-4 rounded-lg flex justify-between items-center';
        alertEl.innerHTML = `
            <div>
                <p class="font-bold text-white">${newAlert.type}</p>
                <p class="text-sm text-gray-400">${newAlert.location} - <span class="text-red-400">${newAlert.status}</span></p>
            </div>
            <span class="text-sm text-gray-500">${newAlert.timestamp}</span>
        `;
        emergencyListEl.prepend(alertEl);
    });
});
