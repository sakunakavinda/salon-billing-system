const pool = require("../../db");

// Function to create a new user
const createUser = async (userData) => {
  const { username, password, role } = userData;

  const query = `
    INSERT INTO users (username, password, role)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const values = [username, password, role];
  const result = await pool.query(query, values);

  return result.rows[0];
};



// Function to get all users
const getAllUsers = async () => {
  const query = `
    SELECT id, username, role, created_at, status
    FROM users where role = 'cashier' AND status = 'active'
    ORDER BY created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};


// const deleteUser = async (id) => {
//   const query = `
//     UPDATE users 
//     SET status = 'inactive'
//     WHERE id = $1
//     RETURNING *
//   `;
  
//   const result = await pool.query(query, [id]);
//   return result.rows[0];
// };

const deleteUser = async (id) => {
  const query = `
    DELETE FROM users 
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};


module.exports = { createUser, getAllUsers, deleteUser };
