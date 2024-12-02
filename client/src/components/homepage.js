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
    <div
      className="min-h-screen w-screen min-w-screen overflow-hidden bg-[#191A1C]
      "
      style={{ backgroundImage: "url('./assets/Check-BG.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left bottom",
        backgroundSize: "100% 80%",
        backgroundAttachment: "fixed",
        
       }}
      // style={{
      //   // background: "linear-gradient(to left, #000000, #CBBD29 25%, #95974E 75%)"
      //   // background: "repeating-linear-gradient(55deg, #000000, #000000 10%, #CBBD29 10%, #CBBD29 20%, #23A461 20%, #23A461 30%)"
      //   background:
      //     "linear-gradient(180deg, #000000 9%,  #C33764 20%, #1D2671 99%)",
      // }}
    >
      {/* <div
    className="absolute inset-0  blur-md "
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // background: "repeating-linear-gradient(55deg, #000000, #000000 10%, #CBBD29 10%, #CBBD29 20%, #23A461 20%, #23A461 30%)", // Apply the same background here
      
      filter: "blur(3px)", // Adjust the blur as necessary
    }}
  ></div> */}

      <header className=" flex justify-end pt-2 ">
        <button
          onClick={handleLogOut}
          className="text-md font-bold  text-white mr-8"
        >
          Logout
        </button>
      </header>

      <main
        className="mt-5 mx-auto rounded-md relative shadow-xl "
        // style={{
        //   background:
        //     "linear-gradient(to right, #000000 5%, #CBBD29 55%,  #000000 92%) ",
        // }}
      >
        <h1 className="mx-auto flex justify-center py-3 font-bold text-[#C6B796] whitespace-nowrap">
          <span className="text-5xl/[35px]  py-3 px-1">
            Cash
            <span className="inline-block h-[45px] w-[45px] sm:h-[45px] sm:w-[45px] mx-1 overflow-hidden rounded-full scale-110">
              <img
                src="/assets/Logo1.webp"
                alt="logo"
                className="w-full h-full object-cover object-center"
              />
            </span>
            ver
          </span>
        </h1>

        <span className="absolute right-[-22px] bottom-7 transform rotate-90 text-2xl font-bold text-[#FAEAB6] ">
          F<span className="text-white">L</span>O
          <span className="text-white">W</span>
        </span>
      </main>

      <section
        onClick={() => handleRedirect("/income")}
        className="mt-3 mx-auto flex justify-center h-full  rounded-md  relative hover:scale-105 hover:bg-[#23A461]"
        // style={{
        //   background: "linear-gradient(#000000 5%, #23A461 55%,  #000000 92%)",
        // }}
      >
        <h4 className="pl-2 flex justify-center text-3xl font-bold italic text-white ">
          Income: <span className="text-[#white]"> {incomeTotal}</span>
        </h4>
      </section>

      <section
        onClick={() => handleRedirect("/fixed")}
        className="mt-3 mx-auto h-[125px]  rounded-md  relative"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #23A461 25%, #000000 40%, #000000 58%, #23A461 74% , #000000 87%)",
        // }}
      >
        <span className="absolute right-[-22px] bottom-[50px] transform rotate-90 text-2xl font-bold tracking-wider ">
          FI<span className="text-[#23A461]">XE</span>D
        </span>
        <h4 className="mx-auto flex justify-center pt-3 font-bold text-4xl italic text-white ">
          Core
        </h4>

        <h4 className="flex justify-center items-center pt-5 font-bold text-4xl  text-white ">
          {fixedTotal}
        </h4>
      </section>

      <section
        onClick={() => handleRedirect("/living")}
        className="mt-3 mx-auto h-[125px]  rounded-md  relative"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #95974E 25%, #000000 40%, #000000 58%, #95974E 74% , #000000 87%)",
        // }}
      >
        <span className="absolute right-[-17px] bottom-[45px] transform rotate-90 text-2xl font-bold tracking-wider ">
          F<span className="text-[#95974E]">LE</span>X
        </span>
        <h4 className="mx-auto flex justify-center pt-3 font-bold text-4xl italic text-white ">
          Flow
        </h4>
        <h4 className="flex justify-center items-center pt-5 font-bold text-4xl  text-white ">
          {livingTotal}
        </h4>
      </section>

      {/* #974E4E // max-w-[350px] sm:max-w-[500px]*/}
      <section
        onClick={() => handleRedirect("/extra")}
        className="mt-3 mx-auto h-[125px]  rounded-md   relative"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #974E4E 25%, #000000 40%, #000000 58%, #974E4E 74% , #000000 87%)",
        // }}
      >
        <span className="absolute right-[-24px] bottom-[54px] transform rotate-90 text-2xl font-bold tracking-tight ">
          EX<span className="text-[#974E4E]">TR</span>A
        </span>
        <h4 className="mx-auto flex justify-center pt-3 font-bold text-4xl italic text-white ">
          Overflow
        </h4>
        <h4 className="flex justify-center items-center pt-5 font-bold text-4xl  text-white ">
          {extraTotal}
        </h4>
      </section>

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
