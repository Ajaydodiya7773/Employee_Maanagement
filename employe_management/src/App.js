import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', salary: '', age: '' });
  const [editEmployee, setEditEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees', error);
    }
  };

  const filterEmployees = () => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = employees.filter(employee =>
      employee.employee_name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredEmployees(filtered);
  };

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post('https://dummy.restapiexample.com/api/v1/create', newEmployee);
      setEmployees([...employees, response.data.data]);
      setNewEmployee({ name: '', salary: '', age: '' });
    } catch (error) {
      console.error('Error adding employee', error);
    }
  };

  const handleUpdateEmployee = async (id) => {
    try {
      const response = await axios.put(`https://dummy.restapiexample.com/api/v1/update/${id}`, editEmployee);
      setEmployees(employees.map(emp => (emp.id === id ? response.data.data : emp)));
      setEditEmployee(null);
    } catch (error) {
      console.error('Error updating employee', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await axios.delete(`https://dummy.restapiexample.com/api/v1/delete/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee', error);
    }
  };

  return (
    <div>
      <h1>Employee Management</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <h2>Add New Employee</h2>
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Salary"
          value={newEmployee.salary}
          onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
        />
        <input
          type="text"
          placeholder="Age"
          value={newEmployee.age}
          onChange={(e) => setNewEmployee({ ...newEmployee, age: e.target.value })}
        />
        <button onClick={handleAddEmployee}>Add Employee</button>
      </div>
      <div>
        <h2>Employee List</h2>
        {filteredEmployees.map(employee => (
          <div key={employee.id} className="employee-item">
            <p>{employee.employee_name} - {employee.employee_salary} - {employee.employee_age}</p>
            <div>
              <button className="delete" onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
              <button onClick={() => setEditEmployee(employee)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
      {editEmployee && (
        <div>
          <h2>Edit Employee</h2>
          <input
            type="text"
            placeholder="Name"
            value={editEmployee.employee_name}
            onChange={(e) => setEditEmployee({ ...editEmployee, employee_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Salary"
            value={editEmployee.employee_salary}
            onChange={(e) => setEditEmployee({ ...editEmployee, employee_salary: e.target.value })}
          />
          <input
            type="text"
            placeholder="Age"
            value={editEmployee.employee_age}
            onChange={(e) => setEditEmployee({ ...editEmployee, employee_age: e.target.value })}
          />
          <button onClick={() => handleUpdateEmployee(editEmployee.id)}>Update</button>
        </div>
      )}
    </div>
  );
};

export default App;
