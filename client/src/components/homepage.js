import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactCalendar from "./ReactCalendar"; // Import your ReactCalendar component
import { formatNumberWithCurrency } from "../utils/currencyUtils"; // Ensure this import works

function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategoryTotals();
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30); // Default range: last 30 days
    fetchExpensesByDateRange(
      lastMonth.toISOString().split("T")[0],
      today.toISOString().split("T")[0]
    );
  }, [selectedCurrency]);

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
      setOverflowTotal(
        overflowRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );
      setIncomeTotal(incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0));
    } catch (error) {
      console.error("Error fetching category totals:", error);
    }
  }

  async function fetchExpensesByDateRange(startDate, endDate) {
    try {
      const response = await axios.get(
        `http://localhost:8080/expenses/byDate?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses by date range:", error);
    }
  }

  const handleRedirect = (path) => {
    navigate(path);
  };

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
        backgroundImage: "url('assets/Check-BGCREDIT.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="flex justify-between items-center px-5 py-3 bg-[#212735] shadow-md">
        <h1 className="text-[#C6B796] text-4xl font-bold flex items-center">
          Cash
          <span className="inline-block mx-2 h-8 w-8 overflow-hidden rounded-full">
            <img
              src="/assets/Logo1.webp"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </span>
          ver Flow
        </h1>
        <button
          onClick={handleLogOut}
          className="text-md sm:text-lg lg:text-xl font-bold text-white bg-[#FAEAB6] py-1 px-4 rounded-lg hover:bg-[#f3d98b]"
        >
          Logout
        </button>
      </header>

      <div className="flex justify-center mt-5">
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

      <div className="grid grid-cols-4 gap-5 px-10 mt-10">
        <div
          onClick={() => handleRedirect("/income")}
          className="bg-[#212735] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform"
        >
          <h3 className="text-xl font-bold">Income</h3>
          <p className="text-2xl mt-2">
            {formatNumberWithCurrency(incomeTotal, selectedCurrency)}
          </p>
        </div>
        <div
          onClick={() => handleRedirect("/core")}
          className="bg-[#212735] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform"
        >
          <h3 className="text-xl font-bold">Core</h3>
          <p className="text-2xl mt-2">
            {formatNumberWithCurrency(coreTotal, selectedCurrency)}
          </p>
        </div>
        <div
          onClick={() => handleRedirect("/flow")}
          className="bg-[#212735] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform"
        >
          <h3 className="text-xl font-bold">Flow</h3>
          <p className="text-2xl mt-2">
            {formatNumberWithCurrency(flowTotal, selectedCurrency)}
          </p>
        </div>
        <div
          onClick={() => handleRedirect("/overflow")}
          className="bg-[#212735] text-[#FAEAB6] p-5 rounded-lg shadow-lg text-center cursor-pointer hover:scale-105 transition transform"
        >
          <h3 className="text-xl font-bold">Overflow</h3>
          <p className="text-2xl mt-2">
            {formatNumberWithCurrency(overflowTotal, selectedCurrency)}
          </p>
        </div>
      </div>

      <aside className="w-full mt-10 px-10">
        <ReactCalendar
          expenses={expenses}
          onDateChange={(date) => {
            const formattedDate = date.toISOString().split("T")[0];
            fetchExpensesByDateRange(formattedDate, formattedDate);
          }}
        />
      </aside>
    </div>
  );
}

export default Homepage;
