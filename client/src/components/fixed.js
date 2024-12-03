import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

let expenseInitialValue = {
  tittle: "",
  amount: "",
  category: "",
};

// let totalInitialValue = {
//     fixed: 0,
//     living: 0,
//     extra: 0,
//     income: 0,
//     savings: 0,
//   }

function Fixed({}) {
  const [expenseData, setExpenseData] = useState(expenseInitialValue);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null); //monitors the expense in edit mode by keeping track of the ID
  const [editingExpenseData, setEditingExpenseData] =
    useState(expenseInitialValue); // holds the data of the expense being edited {title:, amount: etc}
  const [categoryTotal, setCategoryTotal] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const category = location.pathname.replace("/", ""); // Extract category from URL
  const navigate = useNavigate();

  useEffect(() => {
    getExpenses();
    calculateCategoryTotal();
    setExpenseData((prev) => ({ ...prev, category })); // Resets expense data category when the category changes, ensures the category is always up to date
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) {
      return;
    }
    setExpenseData({
      ...expenseData,
      [name]: value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) {
      return;
    }
    setEditingExpenseData({
      ...editingExpenseData,
      [name]: value,
    });
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      createNewExpense();
    }
  };

  async function createNewExpense() {
    try {
      const res = await axios.post(
        "http://localhost:8080/expenses/addNewExpense",
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setExpenseData((prev) => ({ ...prev, tittle: "", amount: "" }));
      console.log(res.data);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
    }
  }

  async function getExpenses(z) {
    try {
      const res = await axios.get(
        `http://localhost:8080/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategoryExpenses(res.data);
      //   const total = res.data.reduce((sum, item) => sum + item.amount, 0);

      // console.log(res.data);

      //   calculateCategoryTotal(); // Update the total after fetching expenses (I think not needed)
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExpense(expenseId) {
    //this is x
    try {
      const res = await axios.put(
        `http://localhost:8080/expenses/updateExpense/${expenseId}`,
        editingExpenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingExpenseId(null);
      console.log(res.data);
      setEditingExpenseData(expenseInitialValue);
      getExpenses();
      calculateCategoryTotal(); 
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      let res = await axios.delete(
        `http://localhost:8080/expenses/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(res.data);
      getExpenses();
      calculateCategoryTotal(); 
    } catch (error) {
      console.log(error);
    }
  }

  //   async function deleteAllExpense() {
  //     try {
  //       let res = await axios.delete(
  //         `http://localhost:8080/expenses/deleteAllExpenses`
  //       );

  //       console.log(res.data);
  //       getExpenses();
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  async function calculateCategoryTotal() {
    try {
      let res = await axios.get(
        `http://localhost:8080/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      let total = res.data.reduce((sum, item) => sum + Number(item.amount), 0);
      setCategoryTotal(total); // Update the state variable with the total amount
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-[#212735]">
      <div className="w-full flex justify-center mx-auto">
        <button
          className="flex justify-start mt-3 "
          onClick={() => navigate("/")}
        >
          <img
            src="/assets/reply-gold.svg"
            alt="back"
            className="w-6 sm:w-10 h-8 sm:h-8 ml-2 absolute"
          />
        </button>
        <h1 className="mx-auto mt-3 mb-5 text-xl sm:text-2xl lg:text-3xl font-bold text-[#FAEAB6]">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>
      <div className="mx-auto flex justify-center  my-5 ">
        <button
          className="text-[#FAEAB6] hover:scale-[1.3] ml-3 text-xl sm:text-2xl lg:text-3xl  px-1 "
          onClick={createNewExpense}
        >
          Add{" "}
        </button>
        <div className="inline-flex ">

          <input
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder="tittle"
            name="tittle"
            value={expenseData.tittle}
            className="max-w-[100px] sm:max-w-[150px] lg:max-w-[200px] sm:text-xl lg:text-2xl ml-3 bg-[rgba(255,255,255,0.87)] rounded-lg"
            maxLength="10"
          />
          <input
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder="amount"
            type="number"
            name="amount"
            value={expenseData.amount}
            className="max-w-[100px] sm:max-w-[150px] lg:max-w-[200px] sm:text-xl lg:text-2xl  ml-3 bg-[rgba(255,255,255,0.87)] rounded-lg"
            max="99999"
          />
        </div>
      </div>

      {/* <button onClick={getExpenses} className="mr-5 ">All fixed costs</button>
      <button className="ml-5" onClick={deleteAllExpense}>delete all</button> */}

      {/* When edit is clicked */}{/* inside edit */}
      {categoryExpenses.map((x, index) => (
        <div key={index} className="flex items-center my-2 ">
          <ul className="flex w-full ">
            {editingExpenseId === x._id ? (
              <>
                {/* text-[#C6B796] text-[#FAEAB6] */}
                <li className="flex-1 p-2 bg-[rgb(214,200,156)] rounded-l-lg">
                  <input
                    onChange={handleEditChange}
                    placeholder="tittle"
                    name="tittle"
                    value={editingExpenseData.tittle}
                    className="max-w-[100px] bg-[rgba(255,255,255,0.87)] sm:text-xl lg:text-2xl border border-[#212735] rounded-lg"
                    maxLength="10"
                  />
                </li>

                <li className="flex-1 bg-[rgb(198,183,150)] pt-2">
                  <input
                    onChange={handleEditChange}
                    placeholder="amount"
                    type="number"
                    name="amount"
                    value={editingExpenseData.amount}
                    className="max-w-[100px] ml-2 bg-[rgba(255,255,255,0.87)] sm:text-xl lg:text-2xl border border-[#212735] rounded-lg"
                    max="99999"
                  />
                </li>
              </>
            ) : (
              //  added info - display
              <>
                <li className="flex-1 p-2  bg-[rgba(214,200,156,0.87)] sm:text-xl lg:text-2xl text-[#212735] rounded-l-lg">
                  {" "}
                  {x.tittle}
                </li>
                <li className="flex-1 bg-[rgb(198,183,150)] p-2 sm:text-xl lg:text-2xl text-[#212735]">
                  {x.amount}
                </li>
              </>
            )}
            {/* inside edit */}
            {editingExpenseId === x._id ? (
              <>
                <button
                  className="px-2 bg-[white] sm:text-xl lg:text-2xl"
                  onClick={() => updateExpense(x._id)}
                >
                  Save
                </button>
                <button
                  className="p-2 bg-red-500 sm:text-xl lg:text-2xl text-white rounded-r-lg"
                  onClick={() => setEditingExpenseId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-3 bg-[white] sm:text-xl lg:text-2xl"
                  onClick={() => {
                    console.log("Editing:", x);
                    setEditingExpenseId(x._id);
                    setEditingExpenseData({
                      tittle: x.tittle,
                      amount: x.amount,
                      category,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="px-[10px] bg-red-500 text-white sm:text-xl lg:text-2xl rounded-r-lg"
                  onClick={() => deleteExpense(x._id)}
                >
                  Delete
                </button>
              </>
            )}
          </ul>
        </div>
      ))}

      {/* total  */}
      <div className="mx-auto flex justify-center mt-5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FAEAB6]">
          Total:{categoryTotal}{" "}
        </h2>

      </div>
    </div>
  );
}
export default Fixed;
