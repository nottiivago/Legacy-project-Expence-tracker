import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// 🛠️ Removed 'date' from the input fields but retained its default value for backend use
let expenseInitialValue = {
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0], // Default date set to today
};

function Fixed() {
  const [expenseData, setExpenseData] = useState(expenseInitialValue);
  const [categoryExpenses, setCategoryExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editingExpenseData, setEditingExpenseData] = useState(expenseInitialValue);
  const [categoryTotal, setCategoryTotal] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const category = location.pathname.replace("/", "");

  useEffect(() => {
    getExpenses();
    calculateCategoryTotal();
    setExpenseData((prev) => ({ ...prev, category })); // Update the category in expenseData
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) return;
    setExpenseData({
      ...expenseData,
      [name]: name === "amount" ? Number(value) : value, // Convert 'amount' to a number
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "amount" && value > 999999) return;
    setEditingExpenseData({
      ...editingExpenseData,
      [name]: name === "amount" ? Number(value) : value, // Convert 'amount' to a number
    });
  };

  // Function to trigger 'Add Expense' on pressing 'Enter'
  const handleKeyDown = (e) => {
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
      console.log(res.data);
      setExpenseData((prev) => ({
        ...expenseInitialValue,
        category,
      })); // Reset title, amount, and date, but keep the current category
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
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
      setCategoryExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateExpense(expenseId) {
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
      setEditingExpenseData(expenseInitialValue);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      const res = await axios.delete(
        `http://localhost:8080/expenses/deleteExpense/${expenseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = (expense) => {
    setEditingExpenseId(expense._id); // Save the ID of the expense to update
    setEditingExpenseData(expense); // Set the editing state with the expense data
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8080/expenses/updateExpense/${editingExpenseId}`,
        editingExpenseData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingExpenseId(null);
      setEditingExpenseData(expenseInitialValue);
      getExpenses();
      calculateCategoryTotal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen min-w-screen bg-[#212735]">
      <div className="w-full flex justify-center mx-auto">
        <button className="flex justify-start mt-3" onClick={() => navigate("/")}>
          <img src="/assets/reply-gold.svg" alt="back" className="w-6 sm:w-10 h-8 sm:h-8 ml-2 absolute" />
        </button>
        <h1 className="mx-auto mt-3 mb-5 text-xl font-bold text-[#FAEAB6]">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
      </div>

      <div className="mx-auto flex justify-center my-5">
        <button
          onClick={createNewExpense}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={expenseData.title}
          onChange={handleChange}
          className="ml-2 p-2 rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={expenseData.amount}
          onChange={handleChange}
          onKeyDown={handleKeyDown} // Detect Enter key press
          className="ml-2 p-2 rounded"
        />
        {/* Removed the date input */}
      </div>

      {/* Styled Expenses List */}
      <div className="space-y-4">
        {categoryExpenses.map((expense, index) => (
          <div
            key={index}
            className="bg-[#2C3E50] p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <p className="text-white">
              {expense.title} - ${expense.amount} on {new Date(expense.date).toLocaleDateString()}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(expense)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteExpense(expense._id)} // Use unique _id for delete
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-out box for the Total */}
      <div className="mt-5 flex justify-center">
        <div className="bg-[#1ABC9C] text-white text-xl font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
          Total: ${categoryTotal}
        </div>
      </div>

      {/* Edit Expense Form */}
      {editingExpenseId && (
        <div className="mt-5 flex justify-center">
          <div className="bg-[#2C3E50] p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-white text-xl mb-4">Edit Expense</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editingExpenseData.title}
              onChange={handleEditChange}
              className="p-2 rounded mb-2 w-full"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={editingExpenseData.amount}
              onChange={handleEditChange}
              className="p-2 rounded mb-2 w-full"
            />
            <button
              onClick={handleSaveEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingExpenseId(null)} // Close edit mode without saving
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fixed;
