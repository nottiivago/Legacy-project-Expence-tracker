import React, { useState, useEffect, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ReactCharts = ({ token, startDate, endDate }) => {
  const [chartData, setChartData] = useState({ categories: [], amounts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if the date range is valid
  const isValidDateRange = useCallback((startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end; // Ensure startDate is earlier than or equal to endDate
  }, []);

  // Fetch chart data with useCallback
  const fetchChartData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `http://localhost:8080/expenses/chart-data?startDate=${startDate}&endDate=${endDate}`,
        { headers }
      );

      const data = response.data;
      console.log("Chart Data Response:", data); // Debugging log

      if (!data.categories || data.categories.length === 0) {
        setError("No data available for the selected date range.");
        return;
      }

      setChartData(data);
    } catch (err) {
      console.error("Error fetching chart data:", err.message);
      setError("Failed to fetch chart data. Please check your backend.");
    } finally {
      setLoading(false);
    }
  }, [token, startDate, endDate]);

  // Fetch data when the component mounts or when startDate/endDate changes
  useEffect(() => {
    if (isValidDateRange(startDate, endDate)) {
      fetchChartData();
    } else {
      setError("Invalid date range. Start date must be earlier than end date.");
    }
  }, [startDate, endDate, fetchChartData, isValidDateRange]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
  };

  const chartDataset = {
    labels: chartData.categories, // Should map to category names
    datasets: [
      {
        label: "Expenses by Category",
        data: chartData.amounts, // Should map to total amounts
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#FFC107"],
        borderWidth: 1,
      },
    ],
  };
  console.log("Chart Dataset:", chartDataset); // Add this line
  

  return (
<div className="chart-container" style={{ padding: "20px", maxWidth: "600px", height: "400px", margin: "auto" }}>
  {loading ? (
    <p>Loading chart data...</p>
  ) : error ? (
    <p style={{ color: "red" }}>{error}</p>
  ) : (
    <Bar data={chartDataset} options={chartOptions} />
  )}
</div>

  );
  
};

export default ReactCharts;
