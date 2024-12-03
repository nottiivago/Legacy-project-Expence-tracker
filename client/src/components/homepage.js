import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Homepage() {
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [coreTotal, setCoreTotal] = useState(0);
  const [flowTotal, setFlowTotal] = useState(0);
  const [overflowTotal, setOverflowTotal] = useState(0);

  useEffect(() => {
    fetchCategoryTotals();
  }, []);

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
      );

      const overflowRes = await axios.get(
        "http://localhost:8080/expenses/allExpenses/overflow",

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


      const coreTotal = coreRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );
      const flowTotal = flowRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
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
      className="min-h-screen w-screen min-w-screen overflow-hidden "
      style={{
        
        backgroundImage: "url('assets/Check-BGCREDIT.jpg')",
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

        </h1>
      </div>


      <section
        onClick={() => handleRedirect("/income")}
        className="mt-3 lg:mt-7 p-2  ml-5 inline-flex justify-start shadow-[10px_0_15px_rgba(0,0,0,0.3)]  text-[#C6B796] hover:text-[#FAEAB6] rounded-full  hover:scale-110  bg-[#212735] backdrop-blur-md bg-transparent"
        >
        <h4 className="pl-2 flex text-4xl sm:text-5xl font-bold italic  text-nowrap">
          Income: {incomeTotal}
        </h4>
      </section>

      <div className=" flex pt-5 lg:mt-7">
      <img
            src="/assets/coins-solid.svg"
            alt="back"
            className="w-6 h-6 ml-7 mt-[5px] "
          />
        <h4 className="text-3xl sm:text-4xl px-1   justify-start h-full  rounded-md   underline  font-bold text-[#101e40] ">
          Expenses

        </h4>
        <img
            src="/assets/coins-solid.svg"
            alt="back"
            className="w-6 h-6  mt-[5px]"
          />
      </div>


      <section
        onClick={() => handleRedirect("/core")}
       className="mt-3 lg:mt-10 p-2  ml-5 inline-flex justify-start shadow-[10px_0_15px_rgba(0,0,0,0.3)] border-[#212735] text-[#C6B796] hover:text-[#FAEAB6] rounded-full  hover:scale-110  bg-[#212735] backdrop-blur-md bg-transparent"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #23A461 25%, #000000 40%, #000000 58%, #23A461 74% , #000000 87%)",
        // }}
      >
        <h4 className="font-bold text-4xl sm:text-5xl italic text-nowrap">
          Core:<span className="hover:text-[]">&nbsp;{coreTotal}</span>

        </h4>
      </section>

      <h1></h1>
      <section
        onClick={() => handleRedirect("/flow")}
        className="mt-3 lg:mt-7 p-2  ml-5 inline-flex justify-start shadow-[10px_0_15px_rgba(0,0,0,0.3)] border-[#212735] text-[#C6B796] hover:text-[#FAEAB6] rounded-full  hover:scale-110  bg-[#212735] backdrop-blur-md bg-transparent"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #95974E 25%, #000000 40%, #000000 58%, #95974E 74% , #000000 87%)",
        // }}
      >
        <h4 className=" font-bold text-4xl sm:text-5xl italic text-nowrap ">
          Flow: {flowTotal}
        </h4>
      </section>
      <h1></h1>
      {/* #974E4E // max-w-[350px] sm:max-w-[500px]*/}
      <section
        onClick={() => handleRedirect("/overflow")}
       className="mt-3 lg:mt-7 p-2 ml-5 inline-flex justify-start shadow-[10px_0_15px_rgba(0,0,0,0.3)] border-[#212735] text-[#C6B796] hover:text-[#FAEAB6] rounded-full  hover:scale-110  bg-[#212735] backdrop-blur-md bg-transparent"
        // style={{
        //   background:
        //     "linear-gradient(#000000 10%, #974E4E 25%, #000000 40%, #000000 58%, #974E4E 74% , #000000 87%)",
        // }}
      >
        <h4 className="font-bold text-4xl sm:text-5xl italic  text-nowrap">
          Overflow: {overflowTotal}
        </h4>
        <h4 className="flex justify-center items-center pt-5 font-bold text-4xl  text-white "></h4>
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
