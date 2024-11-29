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

  useEffect(() => {
    getExpenses();
    calculateCategoryTotal();
    // Resets expense data category when the category changes, ensures the category is always up to date
    setExpenseData((prev) => ({ ...prev, category }));
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convert the value to a number before setting it
    setExpenseData({
      ...expenseData,
      [name]: name === "amount" ? Number(value) || 0 : value, // Ensure amount is always a number
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingExpenseData({
      ...editingExpenseData,
      [name]: name === "amount" ? Number(value) || 0 : value, // Ensure amount is always a number
    });
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
      calculateCategoryTotal(); // Update the total after creating a new expense
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
      console.log(res.data);
      //   calculateCategoryTotal(); // Update the total after fetching expenses (I think not needed)
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExpense(expenseId) {
    //Doesn't save the updated expense
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
      calculateCategoryTotal(); // Update the total after updating an expense
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
      calculateCategoryTotal(); // Update the total after deleting an expense
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
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <button onClick={() => navigate("/")}>back</button>
      <h1 className="mx-auto flex justify-center mt-3 mb-5 text-xl font-bold">
        {/* {category} Expenses  */}
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
      <div className="mx-auto flex items-start my-5 ">
        <button onClick={createNewExpense}>Add {category} expense:</button>
        <div className="inline">
          <input
            onChange={handleChange}
            placeholder="tittle"
            name="tittle"
            value={expenseData.tittle}
            className="ml-5"
          />
          <input
            onChange={handleChange}
            placeholder="amount"
            type="number"
            name="amount"
            value={expenseData.amount}
          />
        </div>
      </div>

      {/* <button onClick={getExpenses} className="mr-5 ">All fixed costs</button>
      <button className="ml-5" onClick={deleteAllExpense}>delete all</button> */}

      {categoryExpenses.map((x, index) => (
        <div key={index} className="flex items-center my-2">
          <ul className="flex w-full">
            {editingExpenseId === x._id ? (
              <>
                <li className="flex-1 p-2 bg-green-700">
                  <input
                    onChange={handleEditChange}
                    placeholder="tittle"
                    name="tittle"
                    value={editingExpenseData.tittle}
                  />
                </li>

                <li className="flex-1 bg-green-800 p-2">
                  <input
                    onChange={handleEditChange}
                    placeholder="amount"
                    type="number"
                    name="amount"
                    value={editingExpenseData.amount}
                  />
                </li>
              </>
            ) : (
              <>
                <li className="flex-1 p-2 bg-green-700">tittle: {x.tittle}</li>
                <li className="flex-1 bg-green-800 p-2 text-white">
                  Cost: {x.amount}
                </li>
              </>
            )}
            {editingExpenseId === x._id ? (
              <>
                <button
                  className="my-1 mx-2"
                  onClick={() => updateExpense(x._id)}
                >
                  Save
                </button>
                <button
                  className="p-2 bg-red-500 text-white"
                  onClick={() => setEditingExpenseId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="my-1 mx-2"
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
                  className="p-2 bg-red-500 text-white"
                  onClick={() => deleteExpense(x._id)}
                >
                  Delete
                </button>
              </>
            )}
          </ul>
        </div>
      ))}
      {/* Display the category total at the bottom of the page */}
      <div className="mx-auto flex justify-center mt-5">
        <h2 className="text-xl font-bold">Total:{categoryTotal} </h2>
      </div>
    </>
  );
}
export default Fixed;
