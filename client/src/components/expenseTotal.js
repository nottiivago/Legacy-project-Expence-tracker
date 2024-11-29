// import { useState, useEffect } from 'react';
// import axios from 'axios';

// function ExpenseComponent({ category }) {
//   const [expenseData, setExpenseData] = useState({ category: '', expenses: [], total: 0 });

//   useEffect(() => {
//     async function getExpenses() {
//       try {
//         const res = await axios.get(`http://localhost:8080/expenses/allExpenses/${category}`);
//         const expenses = res.data;
//         const total = expenses.reduce((sum, item) => sum + item.amount, 0);
//         setExpenseData({ category, expenses, total });
//         console.log(expenses);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     getExpenses();
//   }, [category]);

//   return (
//     <div>
//       <h1>Expenses for {expenseData.category}</h1>
//       <ul>
//         {expenseData.expenses.map((expense) => (
//           <li key={expense.id}>{expense.name}: ${expense.amount}</li>
//         ))}
//       </ul>
//       <h2>Total: ${expenseData.total}</h2>
//     </div>
//   );
// }

// export default ExpenseComponent;