import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//functionality&calculation for total of each number and Income edit and update after Income Schema is created
function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [fixedTotal, setFixedTotal] = useState(0);
  const [livingTotal, setLivingTotal] = useState(0);
  const [extraTotal, setExtraTotal] = useState(0);

  useEffect(() => {
    fetchCategoryTotals();
  }, []);

  async function fetchCategoryTotals() {
    try {
      const fixedRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/fixed",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const livingRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/living",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const extraRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/extra",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const incomeRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/income",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const fixedTotal = fixedRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const livingTotal = livingRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const extraTotal = extraRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const incomeTotal = incomeRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setFixedTotal(fixedTotal);
      setLivingTotal(livingTotal);
      setExtraTotal(extraTotal);
      setIncomeTotal(incomeTotal);
    } catch (error) {
      console.log(error);
    }
  }

  //   const handleIncomeChange = (e) => {
  //     setIncome(e.target.value);
  //   };

  const navigate = useNavigate();

  const handleRedirect = (path) => {
    navigate(path);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //   const updateCategoryTotal = (category, total) => {
  //     setTotals((prev) => ({ ...prev, [category]: total }));
  //   };

  return (
    <div className="App h-full px-3">
      <button
        onClick={handleLogOut}
        className="pl-2 flex justify-center text-xl font-bold"
      >
        Log out
      </button>
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
        <button
          onClick={() => handleRedirect("/income")}
          className="pl-2 flex justify-center text-xl font-bold"
        >
          Income:{incomeTotal}
        </button>
      </div>

      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <button
          onClick={() => handleRedirect("/fixed")}
          className="mx-auto flex justify-center pt-1 font-bold"
        >
          Fixed Costs
        </button>
        <h4 className="flex justify-center items-center pt-5 font-bold  text-green-800">
          {fixedTotal}
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
          {livingTotal}
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
          {extraTotal}
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
