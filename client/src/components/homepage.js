import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';



import ReactCalendar from "./ReactCalendar";
import ReactCharts from "./ReactCharts";
import { formatNumberWithCurrency } from "../utils/currencyUtils";


function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImageName, setProfileImageName] =useState('');


  const [customPercentage, setCustomPercentage] = useState(() => {
    const savedPercentage = localStorage.getItem("customPercentage");
    return savedPercentage ? Number(savedPercentage) : 80;
  });

  const [expenses, setExpenses] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");

  const navigate = useNavigate();


  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30); // Go back 30 days
  
    fetchCategoryTotals();
    fetchExpensesByDateRange(
      lastMonth.toISOString().split("T")[0], // Properly set startDate
      today.toISOString().split("T")[0]     // Properly set endDate
    );
  }, [selectedCurrency]);
  
  <ReactCharts
    token={localStorage.getItem("token")}
    startDate={new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]} // 30 days ago
    endDate={new Date().toISOString().split("T")[0]} // Today
  />
  

  useEffect(() => {
    // Retrieve the custom percentage from local storage when the component mounts
    const savedPercentage = localStorage.getItem("customPercentage");
    if (savedPercentage) {
      setCustomPercentage(Number(savedPercentage));
    }
  }, []);

  useEffect(() => {

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(token);
      
      setFirstName(decodedToken.firstName);
      console.log(firstName);
      setLastName(decodedToken.lastName);
      console.log(lastName);
      setProfileImageName(decodedToken.image);
      console.log(profileImageName);

    }
  }, []);

  

    // Save the custom percentage to local storage whenever it changes
    localStorage.setItem("customPercentage", customPercentage);
  }, [customPercentage]);

  useEffect(() => {
    // Check whenever customPercentage changes
    const totalExpenses = coreTotal + flowTotal + overflowTotal;
    const threshold = incomeTotal * (customPercentage / 100);

    if (totalExpenses > incomeTotal) {
      alert(
        "Warning: Your total expenses are above your income. Please adjust your budget."
      );
    } else if (totalExpenses > threshold) {
      const remainings = 100 - customPercentage;
      alert(
        `Warning: Your expenses are above ${customPercentage}% of your income. Be sure to put ${remainings}% of your income in the saving!`
      );
    }
  }, [customPercentage, coreTotal, flowTotal, overflowTotal, incomeTotal]);


  async function fetchCategoryTotals() {
    try {

      const coreRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/core",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const flowRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/flow",

        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }

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


      const coreTotal = coreRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0

      setOverflowTotal(
        overflowRes.data.reduce((sum, item) => sum + Number(item.amount), 0)

      );
      setIncomeTotal(
        incomeRes.data.reduce((sum, item) => sum + Number(item.amount), 0)
      );

      const overflowTotal = overflowRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const incomeTotal = incomeRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setCoreTotal(coreTotal);
      setFlowTotal(flowTotal);
      setOverflowTotal(overflowTotal);

      setIncomeTotal(incomeTotal);

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

        backgroundImage: "url('/assets/Check-BGCREDIT.jpg')",

        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "100% 100%",
        backgroundAttachment: "fixed",
      }}
    >

      <div
        className="h-[148px] mx-auto bg-[#212735] relative shadow-sm "
        // style={{
        //   background:
        //     "linear-gradient(to right, #000000 5%, #CBBD29 55%,  #000000 92%) ",
        // }}
      >
        <header className="flex justify-end pt-2 ">
        {/* <button onClick={()=>handleRedirect("/userPage")}
          className="text-md sm:text-xl lg:text-2xl font-bold  text-white mr-3"> User page 
          </button> */}
        <div>
        <img 
    src={`http://localhost:8080/uploads/${profileImageName}`} 
    alt={`${firstName} ${lastName}`} 
    className="user-profile-image" 
    style={{ cursor: 'pointer' }} 
    onClick={()=>handleRedirect("/userPage")}
  />
      <h1 style={{color:'white'}} onClick={()=>handleRedirect("/userPage")}>Welcome, {firstName} {lastName}</h1>
    </div>
          <button
            onClick={handleLogOut}
            className="text-md sm:text-xl lg:text-2xl font-bold  text-white mr-3"
          >
            Logout
          </button>
        </header>

        <h1 className="flex justify-center pt-5 sm:pt-0 font-bold text-[#C6B796] whitespace-nowrap ">
          <span className="text-6xl sm:text-7xl   px-1">
            Cash
            <span className="inline-block h-[45px] w-[45px] sm:w-[57px] sm:h-[57px]  mx-1 overflow-hidden rounded-full scale-110">
              <img
                src="/assets/Logo1.webp"
                alt="logo"
                className="w-full h-full object-cover object-center"
              />
            </span>
            ver
          </span>
          <span className="  transform ml-[-20px] sm:ml-[-25px] pt-12 sm:pt-16 text-xl font-bold text-[#FAEAB6] ">
            F<span className="text-white">L</span>O
            <span className="text-white">W</span>
          </span>


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
<div className="flex justify-evenly">
          <div className="flex items-center gap-3">
            <h1 className="text-[#C6B796] text-start mb-2">
              The percentage of income
              at which<br /> you want to
              receive a warning.
            </h1>
            <input
              type="number"
              value={customPercentage}
              onChange={(e) => setCustomPercentage(e.target.value)}
              min="0"
              max="100"
              className="bg-[#C6B796] w-12 rounded-lg border border-[#101e40] text-center sm:text-xl lg:text-2xl placeholder-[#881348]"
              placeholder="Set warning percentage"
            />
            <h1 className="text-[#C6B796] text-3xl">%</h1>
          </div>
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

      {/* Include the Chart Component */}
      <div className="absolute bottom-5 left-5 w-1/3 bg-[#212735] p-5 rounded-lg shadow-lg border border-[#C6B796]">

      </div>
    </div>
  );
}

export default Homepage;
