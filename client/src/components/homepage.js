import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

//functionality&calculation for total of each number and Income edit and update after Income Schema is created
function Homepage() {
  const [income, setIncome] = useState("");
//   const [totals, setTotals] = useState({
//     fixed: 0,
//     living: 0,
//     extra: 0, 
//   });

  const handleIncomeChange = (e) => {
    setIncome(e.target.value);
  };

  const navigate = useNavigate();

   const handleRedirect = (path) => {
    navigate(path);
  };

//   const updateCategoryTotal = (category, total) => { 
//     setTotals((prev) => ({ ...prev, [category]: total }));
//   };

  return (
    <div className="App h-full px-3">
      <div className="mt-5 mx-auto h-full border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <h1 className=" pl-2 flex justify-start text-xl font-bold  ">
          <span className=" border-2 border-green-400">Cash Over</span>flow
        </h1>
        <h2 className="mt-2 pr-2 flex justify-end italic">
          {" "}
          give yourself a raise
        </h2>
      </div>

      <div className="mt-3 mx-auto flex justify-center h-full border-2 border-green-500 rounded-md max-w-[350px] sm:max-w-[500px]  text-green-800">
        <h1 className="pl-2 flex justify-center text-xl font-bold">
          Income:</h1>
          <input
            type="number"
            value={income}
            onChange={handleIncomeChange}
            className="ml-2 w-24 border border-gray-300 rounded px-2"
            placeholder="Monthly"
          />
        
      </div>

      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <button
          onClick={() => handleRedirect("/fixed")}
          className="mx-auto flex justify-center pt-1 font-bold"
        >
          Fixed Costs
        </button>
        <h4 className="flex justify-center items-center pt-5 font-bold  text-green-800">
        {/* {totals.fixed} */} Number
        </h4>
      </div>

      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <button
          onClick={() => handleRedirect("/living")}
          className="mx-auto flex justify-center pt-1 font-bold"
        >
          Living Expenses
        </button>
        <h4 className="flex justify-center items-center pt-5 font-bold  text-yellow-800">
        {/* {totals.living} */}Number
        </h4>
      </div>

      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <button
          onClick={() => handleRedirect("/extra")}
          className="mx-auto flex justify-center pt-1 font-bold"
        >
          Extra
        </button>
        <h4 className="flex justify-center items-center pt-5 font-bold  text-red-800">
        {/* {totals.extra} */}Number
        </h4>
      </div>

      {/* <div className="mt-3 mx-auto flex justify-around max-w-[350px] sm:max-w-[500px]">
        <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
          <button className="">Option1</button>
        </div>
        <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
          <button className="">Option1</button>
        </div>
        <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
          <button className="">Option1</button>
        </div>
      </div> */}
    </div>
  );
}

export default Homepage;
