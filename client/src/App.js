import { useState, useEffect } from "react";
import { BrowserRoutes, Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";




function App() {
//   const [user, setUser] = useState(null);
//   const [expenses,setExpenses] = useState([]);

// async function getAllExpenses() {
// try {
//   let res = await axios.get("http://localhost:8080/allExpenses");
//   setExpenses(res.data);
// } catch (error) {
//   console.log(`Error fetching expenses: ${error}`);
// }

// }




  return (
    <div className="App h-full px-3">

      <div className="mt-5 mx-auto h-full border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <h1 className=" pl-2 flex justify-start text-xl font-bold  "><span className=" border-2 border-green-400">Cash Over</span>flow</h1>
        <h2 className="mt-2 pr-2 flex justify-end italic"> give yourself a raise</h2>
      </div>

      <div className="mt-5 mx-auto h-full border-2 border-green-500 rounded-md max-w-[350px] sm:max-w-[500px]">
        <h1 className=" pl-2 flex justify-center text-xl font-bold text-green-800  ">Income = {"number"}</h1>
        
      </div>

      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <h3 className="flex justify-center pt-1 font-bold">Fixed Costs</h3>
        <h4 className="flex justify-center items=center pt-5 font-bold  text-green-800">Number</h4>
      </div>

      
      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <h3 className="flex justify-center pt-1 font-bold">Living Expenses</h3>
        <h4 className="flex justify-center items=center pt-5 font-bold  text-yellow-800">Number</h4>

      </div>

      
      <div className="mt-3 mx-auto h-[125px] border-2 border-black rounded-md max-w-[350px] sm:max-w-[500px]">
        <h3 className="flex justify-center pt-1 font-bold">Extra</h3>
        <h4 className="flex justify-center items=center pt-5 font-bold  text-red-800">Number</h4>

      </div>

      <div className="mt-10 mx-auto flex justify-around max-w-[350px] sm:max-w-[500px]">
          <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
            <button className="">Option1</button>
          </div>
          <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
            <button className="">Option1</button>
          </div>
          <div className="rounded-full w-20 h-20 sm:w-28 sm:h-28 border-black border-2 flex justify-center items-center">
            <button className="">Option1</button>
          </div>
      </div>





    </div>
  );
}

export default App;

