import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Fixed the import
import ReactCalendar from "./ReactCalendar";
import { formatNumberWithCurrency } from "../utils/currencyUtils";

function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImageName, setProfileImageName] = useState("");
  const [customPercentage, setCustomPercentage] = useState(() => {
    const savedPercentage = localStorage.getItem("customPercentage");
    return savedPercentage ? Number(savedPercentage) : 80;
  });

  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  const navigate = useNavigate();

  // Fetch token and set user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setFirstName(decodedToken.firstName);
      setLastName(decodedToken.lastName);
      setProfileImageName(decodedToken.image);
    }
  }, []);

  // Fetch category totals on page load
  useEffect(() => {
    fetchCategoryTotals();
    fetchExpensesByDateRange(
      new Date(new Date().setDate(new Date().getDate() - 30))
        .toISOString()
        .split("T")[0],
      new Date().toISOString().split("T")[0]
    );
  }, []);

  // Check if total expenses exceed the threshold or total income
  useEffect(() => {
    const totalExpenses = coreTotal + flowTotal + overflowTotal;
    const threshold = incomeTotal * (customPercentage / 100);

    if (totalExpenses > incomeTotal) {
      alert(
        "Warning: Your total expenses are above your income. Please adjust your budget."
      );
    } else if (totalExpenses > threshold) {
      const remainings = 100 - customPercentage;
      alert(
        `Warning: Your expenses are above ${customPercentage}% of your income. Be sure to put ${remainings}% of your income into savings!`
      );
    }
  }, [customPercentage, coreTotal, flowTotal, overflowTotal, incomeTotal]);

  // Save the custom percentage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("customPercentage", customPercentage);
  }, [customPercentage]);

  async function fetchCategoryTotals() {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      const [coreRes, flowRes, overflowRes, incomeRes] = await Promise.all([
        axios.get("http://localhost:8080/expenses/allExpenses/core", {
          headers,
        }),
        axios.get("http://localhost:8080/expenses/allExpenses/flow", {
          headers,
        }),
        axios.get("http://localhost:8080/expenses/allExpenses/overflow", {
          headers,
        }),
        axios.get("http://localhost:8080/expenses/allExpenses/income", {
          headers,
        }),
      ]);

      setCoreTotal(
        coreRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );
      setFlowTotal(
        flowRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );
      setOverflowTotal(
        overflowRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );
      setIncomeTotal(
        incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );
    } catch (error) {
      console.error("Error fetching category totals:", error);
    }
  }

  async function fetchExpensesByDateRange(startDate, endDate) {
    try {
      const response = await axios.get(
        `http://localhost:8080/expenses/byDate?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses by date range:", error);
    }
  }

  const handleRedirect = (path) => navigate(path);
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const currencyOptions = [
    { code: "USD", label: "US Dollar ($)" },
    { code: "EUR", label: "Euro (€)" },
    { code: "GBP", label: "British Pound (£)" },
    { code: "JPY", label: "Japanese Yen (¥)" },
  ];

  return (
    <div
      className="min-h-screen w-screen flex flex-col"
      style={{
        backgroundImage: "url('/assets/Check-BGCREDIT.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="flex justify-between items-center px-5 py-3 bg-[#212735] shadow-md">
        <div className="flex items-center">
          <img
            src={`http://localhost:8080/uploads/${profileImageName}`}
            alt={`${firstName} ${lastName}`}
            className="w-12 h-12 rounded-full mr-4"
            onClick={() => handleRedirect("/userPage")}
          />
          <h1
            className="text-white text-xl font-bold cursor-pointer"
            onClick={() => handleRedirect("/userPage")}
          >
            Welcome, {firstName} {lastName}
          </h1>
        </div>
        <button
          onClick={handleLogOut}
          className="text-md sm:text-lg lg:text-xl font-bold text-black bg-[#FAEAB6] py-1 px-4 rounded-lg hover:bg-[#f3d98b]"
        >
          Logout
        </button>
      </header>

      <div className="flex justify-start mt-5 px-10">
        <select
          className="text-lg sm:text-xl p-2 rounded-md shadow-md"
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          {currencyOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center mt-3 px-10">
        <div
          onClick={() => handleRedirect("/income")}
          className="bg-[#1F2937] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform w-1/2"
        >
          <h3 className="text-2xl font-bold">Income</h3>
          <p className="text-3xl mt-2">
            {formatNumberWithCurrency(incomeTotal, selectedCurrency)}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-10 w-3/4">
          {[
            { label: "Core", total: coreTotal, path: "/core" },
            { label: "Flow", total: flowTotal, path: "/flow" },
            { label: "Overflow", total: overflowTotal, path: "/overflow" },
          ].map(({ label, total, path }) => (
            <div
              key={label}
              onClick={() => handleRedirect(path)}
              className="bg-[#212735] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform"
            >
              <h3 className="text-xl font-bold">{label}</h3>
              <p className="text-2xl mt-2">
                {formatNumberWithCurrency(total, selectedCurrency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <aside>
        <ReactCalendar
          expenses={expenses}
          onDateChange={(date) => {
            const formattedDate = date.toISOString().split("T")[0];
            fetchExpensesByDateRange(formattedDate, formattedDate);
          }}
        />
      </aside>

      <div className="absolute bottom-5 left-5 bg-[#212735] p-3 rounded-lg shadow-md border border-[#C6B796]">
        <label htmlFor="percentageInput" className="text-white text-sm">
          Set Warning Percentage:
        </label>
        <input
          id="percentageInput"
          type="number"
          value={customPercentage}
          onChange={(e) => setCustomPercentage(Number(e.target.value))}
          min="0"
          max="100"
          className="bg-[#FAEAB6] text-black px-2 py-1 rounded-md w-full mt-1"
        />
      </div>
    </div>
  );
}

export default Homepage;
