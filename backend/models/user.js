// Simple in-memory user store
const users = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      department: 'Administration'
    },
    {
      id: '2',
      username: 'doctor1',
      password: 'doctor123',
      role: 'doctor',
      department: 'Cardiology'
    },
    {
      id: '3',
      username: 'nurse1',
      password: 'nurse123',
      role: 'nurse',
      department: 'Emergency'
    }
  ];
  
  const findUserByUsername = (username) => {
    return users.find(u => u.username === username);
  };
  
  const findUserById = (id) => {
    return users.find(u => u.id === id);
  };
  
  module.exports = {
    users,
    findUserByUsername,
    findUserById
  };