import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default styles for the calendar
import './customCalendar.css'; // Custom styles for the calendar

const ReactCalendar = ({ expenses }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
  
    const handleDateChange = (date) => {
      setSelectedDate(date);
    };
  
    const expenseDates = expenses
    .filter(expense => expense.date && !isNaN(new Date(expense.date).getTime())) // Ensure valid dates
    .map(expense => new Date(expense.date).toDateString());
  
  
    return (
      <div className="calendar-container">
        <h3>Expense Calendar</h3>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          tileContent={({ date }) => {
            if (expenseDates.includes(date.toDateString())) {
              return <div className="dot"></div>;
            }
            return null;
          }}
        />
        <div className="selected-date-info">
          <h4>Expenses on {selectedDate.toDateString()}:</h4>
          {expenses
            .filter((expense) => new Date(expense.date).toDateString() === selectedDate.toDateString())
            .map((expense, index) => (
              <p key={index}>
                - {expense.amount} {expense.category}
              </p>
            ))}
          {expenses.filter(
            (expense) =>
              new Date(expense.date).toDateString() === selectedDate.toDateString()
          ).length === 0 && <p>No expenses on this date.</p>}
        </div>
      </div>
    );
  };
  
  export default ReactCalendar;