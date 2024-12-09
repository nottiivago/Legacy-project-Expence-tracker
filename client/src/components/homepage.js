import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

import ReactCalendar from "./ReactCalendar";

import { formatNumberWithCurrency } from "../utils/currencyUtils";

function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImageName, setProfileImageName] = useState('');
  const [customPercentage, setCustomPercentage] = useState(() => {
    const savedPercentage = localStorage.getItem("customPercentage");
    return savedPercentage ? Number(savedPercentage) : 80;
  });

  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  const navigate = useNavigate();

  // Fetch token and set user data
  useEffect(() => {
    const token = localStorage.getItem('token');
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
      new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0],
      new Date().toISOString().split("T")[0]
    );
  }, []);

  // Check if total expenses exceed the threshold or total income
  useEffect(() => {
    const totalExpenses = coreTotal + flowTotal + overflowTotal;
    const threshold = incomeTotal * (customPercentage / 100);

    if (totalExpenses > incomeTotal) {
      alert("Warning: Your total expenses are above your income. Please adjust your budget.");
    } else if (totalExpenses > threshold) {
      const remainings = 100 - customPercentage;
      alert(`Warning: Your expenses are above ${customPercentage}% of your income. Be sure to put ${remainings}% of your income into savings!`);
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
        axios.get("http://localhost:8080/expenses/allExpenses/core", { headers }),
        axios.get("http://localhost:8080/expenses/allExpenses/flow", { headers }),
        axios.get("http://localhost:8080/expenses/allExpenses/overflow", { headers }),
        axios.get("http://localhost:8080/expenses/allExpenses/income", { headers }),
      ]);

      setCoreTotal(coreRes.data.reduce((sum, item) => sum + Number(item.amount), 0));
      setFlowTotal(flowRes.data.reduce((sum, item) => sum + Number(item.amount), 0));
      setOverflowTotal(overflowRes.data.reduce((sum, item) => sum + Number(item.amount), 0));
      setIncomeTotal(incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0));
    } catch (error) {
      console.error("Error fetching category totals:", error);
    }
  }

  async function fetchExpensesByDateRange(startDate, endDate) {
    try {
      const response = await axios.get(
        `http://localhost:8080/expenses/byDate?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
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
    <div className="min-h-screen w-screen flex flex-col" style={{ backgroundImage: "url('/assets/Check-BGCREDIT.jpg')", backgroundSize: "cover" }}>
      <header className="flex justify-between items-center px-5 py-3 bg-[#212735] shadow-md">
        <div>
          <img src={`http://localhost:8080/uploads/${profileImageName}`} alt={`${firstName} ${lastName}`} onClick={() => handleRedirect("/userPage")} />
          <h1 onClick={() => handleRedirect("/userPage")}>Welcome, {firstName} {lastName}</h1>
        </div>
        <button onClick={handleLogOut} className="text-white">Logout</button>
      </header>

      <div className="flex justify-between items-center mt-5">
        <input
          type="number"
          value={customPercentage}
          onChange={(e) => setCustomPercentage(e.target.value)}
          min="0"
          max="100"
          placeholder="Set warning percentage"
        />
        <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
          {currencyOptions.map(option => (
            <option key={option.code} value={option.code}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="flex">
        <div onClick={() => handleRedirect("/income")}>
          <h3>Income</h3>
          <p>{formatNumberWithCurrency(incomeTotal, selectedCurrency)}</p>
        </div>
        <div onClick={() => handleRedirect("/core")}>
          <h3>Core</h3>
          <p>{formatNumberWithCurrency(coreTotal, selectedCurrency)}</p>
        </div>
        <div onClick={() => handleRedirect("/flow")}>
          <h3>Flow</h3>
          <p>{formatNumberWithCurrency(flowTotal, selectedCurrency)}</p>
        </div>
        <div onClick={() => handleRedirect("/overflow")}>
          <h3>Overflow</h3>
          <p>{formatNumberWithCurrency(overflowTotal, selectedCurrency)}</p>
        </div>
      </div>

      <ReactCalendar
        expenses={expenses}
        onDateChange={(date) => {
          const formattedDate = date.toISOString().split("T")[0];
          fetchExpensesByDateRange(formattedDate, formattedDate);
        }}
      />

      
    </div>
  );
}

export default Homepage;
