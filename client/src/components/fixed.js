import React, { useState } from "react";
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
  const [allExpenses, setAllExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(expenseInitialValue);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function createNewExpense(e) {
    try {
      let res = await axios.post(
        "http://localhost:8080/expenses/addNewExpense",
        formData
      );
      setFormData(expenseInitialValue);

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function getExpenses() {
    try {
      let res = await axios.get(`http://localhost:8080/expenses/allExpenses`);
      setAllExpenses(res.data);
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
        formData
      );
      setSelectedExpense(res.data);
      console.log(res.data);
      setFormData(expenseInitialValue);
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
      <div className="mx-auto flex items-start my-5 ">
        <button onClick={createNewExpense} className=" ">Add fixed expense:</button>
        <div className="inline">
        <input
          onChange={handleChange}
          placeholder="tittle"
          name="tittle"
          value={formData.tittle}
          className="ml-5"
        />
        <input
          onChange={handleChange}
          placeholder="amount"
          name="amount"
          value={formData.amount}
        />
        {/* make this category fixed by default */}
        {/* <input
          onChange={handleChange}
          placeholder="category"
          name="category"
          value={formData.category}
        /> */}
        </div>
      </div>

      <button onClick={getExpenses} className="mr-5 ">All fixed costs</button>
      <button className="ml-5" onClick={deleteAllExpense}>delete all</button>
      <div>
        {allExpenses.map((x, index) => (
          <div
            key={index}
            className="w-[500px] border-2 border-black h-[200px]">
            <ul>
              <ol>{x.tittle}</ol>
              <ol>{x.amount}</ol>
              {/* <ol>{x.category}</ol> */}
            </ul>
            <button className="my-5" onClick={() => setIsEditing(!isEditing)}>
              Edit
            </button>
            {isEditing && (
              <div className="w-500px">
                <input
                  onChange={handleChange}
                  placeholder="Tittle"
                  name="tittle"
                  value={formData.tittle}
                />
                <input
                  onChange={handleChange}
                  placeholder="Amount"
                  name="amount"
                  value={formData.amount}
                />
                {/* <input
                  onChange={handleChange}
                  placeholder="Category"
                  name="category"
                  value={formData.category}
                /> */}
                <button className="mr-3" onClick={() => updateExpense(x._id)}>
                  save
                </button>
                <button className="mr-3" onClick={() => setIsEditing(false)}>
                  cancel
                </button>
                <button className="mr-3" onClick={() => deleteExpense(x._id)}>
                  delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
export default Fixed;
