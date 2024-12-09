import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

let expenseInitialValue = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0], // Default today's date
};

function Fixed() {
  const [expenseData, setExpenseData] = useState(expenseInitialValue);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingExpenseData, setEditingExpenseData] = useState(expenseInitialValue);
  const [categoryTotal, setCategoryTotal] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const category = location.pathname.replace("/", ""); // Extract category from URL

  useEffect(() => {
    getExpenses();
    calculateCategoryTotal();
    setExpenseData((prev) => ({ ...prev, category })); // Update the category
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) return; // Restrict maximum amount
    setExpenseData({
      ...expenseData,
      [name]: value,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) return;
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
      console.log("Expense data being sent:", expenseData); // Debugging line
      const res = await axios.post(
        "http://localhost:8080/expenses/addNewExpense",
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Expense created:", res.data);
      setExpenseData((prev) => ({
        ...prev,
        title: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
      }));
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  }

  async function getExpenses() {
    try {
      const res = await axios.get(
        `http://localhost:8080/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Expenses fetched:", res.data);
      setCategoryExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }

  async function updateExpense(expenseId) {
    try {
      console.log("Updating expense:", editingExpenseData);
      const res = await axios.put(
        `http://localhost:8080/expenses/updateExpense/${expenseId}`,
        editingExpenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Expense updated:", res.data);
      setEditingExpenseId(null);
      setEditingExpenseData(expenseInitialValue);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      console.log("Deleting expense with ID:", expenseId);
      const res = await axios.delete(
        `http://localhost:8080/expenses/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Expense deleted:", res.data);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  async function calculateCategoryTotal() {
    try {
      const res = await axios.get(
        `http://localhost:8080/expenses/allExpenses/${category}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const total = res.data.reduce((sum, item) => sum + Number(item.amount), 0);
      setCategoryTotal(total);
      console.log("Category total:", total);
    } catch (error) {
      console.error("Error calculating total:", error);
    }
  }

  return (
    <div className="min-h-screen min-w-screen bg-[#212735]">
      <div className="w-full flex justify-center mx-auto">
        <button
          className="flex justify-start mt-3"
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

      <div className="mx-auto flex justify-center my-5">
        <button
          className="text-[#FAEAB6] hover:scale-[1.3] ml-3 text-xl sm:text-2xl lg:text-3xl px-1"
          onClick={createNewExpense}
        >
          Add
        </button>
        <div className="inline-flex">
          <input
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder="Title"
            name="title"
            value={expenseData.title}
            className="max-w-[100px] sm:max-w-[150px] lg:max-w-[200px] sm:text-xl lg:text-2xl ml-3 bg-[rgba(255,255,255,0.87)] rounded-lg"
            maxLength="50"
          />
          <input
            onChange={handleChange}
            onKeyDown={handleEnter}
            placeholder="Amount"
            type="number"
            name="amount"
            value={expenseData.amount}
            className="max-w-[100px] sm:max-w-[150px] lg:max-w-[200px] sm:text-xl lg:text-2xl ml-3 bg-[rgba(255,255,255,0.87)] rounded-lg"
            max="999999"
          />
        </div>
      </div>

      {categoryExpenses.map((x, index) => (
        <div key={index} className="flex items-center my-2">
          <ul className="flex w-full">
            {editingExpenseId === x._id ? (
              <>
                <li className="flex-1 p-2 bg-[rgb(214,200,156)] rounded-l-lg">
                  <input
                    onChange={handleEditChange}
                    placeholder="Title"
                    name="title"
                    value={editingExpenseData.title}
                    className="max-w-[100px] bg-[rgba(255,255,255,0.87)] sm:text-xl lg:text-2xl border border-[#212735] rounded-lg"
                    maxLength="50"
                  />
                </li>

                <li className="flex-1 bg-[rgb(198,183,150)] pt-2">
                  <input
                    onChange={handleEditChange}
                    placeholder="Amount"
                    type="number"
                    name="amount"
                    value={editingExpenseData.amount}
                    className="max-w-[100px] ml-2 bg-[rgba(255,255,255,0.87)] sm:text-xl lg:text-2xl border border-[#212735] rounded-lg"
                    max="999999"
                  />
                </li>
              </>
            ) : (
              <>
                <li className="flex-1 p-2 bg-[rgba(214,200,156,0.87)] sm:text-xl lg:text-2xl text-[#212735] rounded-l-lg">
                  {x.title}
                </li>
                <li className="flex-1 bg-[rgb(198,183,150)] p-2 sm:text-xl lg:text-2xl text-[#212735]">
                  {x.amount}
                </li>
              </>
            )}
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
                    setEditingExpenseId(x._id);
                    setEditingExpenseData({
                      title: x.title,
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

      <div className="mx-auto flex justify-center mt-5">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FAEAB6]">
          Total: {categoryTotal}
        </h2>
      </div>
    </div>
  );
}

export default Fixed;
