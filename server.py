from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

# Initialize the Flask application
app = Flask(__name__)
# Enable CORS to allow the HTML file to fetch data from the server
CORS(app)

# This route serves as the API endpoint for all dashboard data.
# In a real-world application, this would fetch data from a database and
# an actual AI model for crowd prediction.
@app.route('/api/dashboard_data', methods=['GET'])
def get_dashboard_data():
    """
    Simulates real-time data for the dashboard.
    """
    # Simulate AI-Powered Crowd Prediction data
    # Predictions are based on a simple formula for demonstration
    current_time = time.localtime().tm_hour
    base_crowd = 500 + 20 * (current_time - 9) if 9 <= current_time <= 18 else 500
    today_prediction = int(base_crowd * random.uniform(0.9, 1.1))
    hourly_prediction = {
        f"{h}:00": int((base_crowd * random.uniform(0.8, 1.2)) * (1 - (abs(h-14)/10)))
        for h in range(9, 22)
    }

    # Simulate Real-Time Crowd Heatmap data
    # Grid of 10x10 areas with a random density from 1 (low) to 5 (critical)
    heatmap_data = [
        {'x': i, 'y': j, 'density': random.randint(1, 5)}
        for i in range(10) for j in range(10)
    ]

    # Simulate Emergency Response data
    emergency_alerts = [
        {"id": 1, "type": "Medical Emergency", "location": "Area B", "status": "Dispatched", "timestamp": "12:35 PM"},
        {"id": 2, "type": "Crowd Density Alert", "location": "Area D", "status": "Resolved", "timestamp": "12:20 PM"}
    ]
    # Add a new random alert occasionally
    if random.random() > 0.8:
        new_alert = {
            "id": int(time.time()),
            "type": random.choice(["Medical Emergency", "Security Issue", "Missing Person"]),
            "location": f"Area {random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}",
            "status": "New",
            "timestamp": time.strftime("%I:%M %p")
        }
        emergency_alerts.insert(0, new_alert)

    # Simulate Resource Manager data
    resources = {
        "water_level": random.randint(10, 100),
        "toilet_availability": random.randint(0, 100),
        "staff_on_duty": 150 + random.randint(-5, 5),
    }

    # Simulate Traffic Control data
    traffic_status = {
        "main_entrance": random.choice(["Low Flow", "Medium Flow", "High Flow", "Congested"]),
        "parking_lot_A": random.choice(["Empty", "Half Full", "Almost Full"]),
        "shuttle_services": random.randint(0, 10)
    }

    response_data = {
        "crowdPrediction": {
            "today": today_prediction,
            "hourly": hourly_prediction
        },
        "heatmapData": heatmap_data,
        "emergencyAlerts": emergency_alerts,
        "resources": resources,
        "trafficStatus": traffic_status
    }

    return jsonify(response_data)

# Run the server
if __name__ == '__main__':
    app.run(debug=True)
