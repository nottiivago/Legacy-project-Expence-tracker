import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

let expenseInitialValue = {
  tittle: "",
  amount: "",
  //   category: "",
  // description: "",
  // userId: "",
};

function Fixed() {
  const [expenseData, setExpenseData] = useState(expenseInitialValue);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null); //keeps track of the expense being edited
  const [editingExpenseData, setEditingExpenseData] =
    useState(expenseInitialValue);

  useEffect(() => {
    getExpenses();
  }, []);

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingExpenseData({
      ...editingExpenseData,
      [e.target.name]: e.target.value,
    });
  };

  async function createNewExpense(e) {
    try {
      let res = await axios.post(
        "http://localhost:8080/expenses/addNewExpense",
        expenseData
      );
      setExpenseData(expenseInitialValue);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getExpenses() {
    try {
      let res = await axios.get(`http://localhost:8080/expenses/allExpenses`);
      setFixedExpenses(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExpense(expenseId) {
    //this is x
    try {
      let res = await axios.put(
        `http://localhost:8080/expenses/updateExpense/${expenseId}`,
        expenseData
      );
      setEditingExpenseId(null);
      console.log(res.data);
      setEditingExpenseData(expenseInitialValue);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      let res = await axios.delete(
        `http://localhost:8080/expenses/deleteExpense/${expenseId}`
      );

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAllExpense() {
    try {
      let res = await axios.delete(
        `http://localhost:8080/expenses/deleteAllExpenses`
      );

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <h1 className="mx-auto flex justify-center mt-3 mb-5 text-xl font-bold">
        Fixed Expenses
      </h1>
      <div className="mx-auto flex items-start my-5 ">
        <button onClick={createNewExpense} className=" ">
          Add fixed expense:
        </button>
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
            name="amount"
            value={expenseData.amount}
          />
          {/* make this category fixed by default */}
          {/* <input
          onChange={handleChange}
          placeholder="category"
          name="category"
          value={expenseData.category}
        /> */}
        </div>
      </div>

      {/* <button onClick={getExpenses} className="mr-5 ">All fixed costs</button>
      <button className="ml-5" onClick={deleteAllExpense}>delete all</button> */}

      {fixedExpenses.map((x, index) => (
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
                <li className="flex-1 bg-green-800 p-2 text-white">
                  <input
                    onChange={handleEditChange}
                    placeholder="amount"
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

      
    </>
  );
}
export default Fixed;
