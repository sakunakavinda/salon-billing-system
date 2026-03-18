const pool = require("../../db");

// Function to create a new service
const createService = async (serviceData) => {
  const { name, price, description } = serviceData;

  const query = `
    INSERT INTO services (service_name, price, description, status)
    VALUES ($1, $2, $3, 'active')
    RETURNING *
  `;

  const values = [name, price, description || null];
  const result = await pool.query(query, values);

  return result.rows[0];
};


// Function to get all services
const getAllServices = async () => {
  const query = `
    SELECT id, service_name, price, description, status 
    FROM services 
    ORDER BY id ASC
  `;
  
  const result = await pool.query(query);
  return result.rows;
};

const getServiceById = async (id) => {
  const query = `
    SELECT id, service_name, price, description, status 
    FROM services 
    WHERE id = $1
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const updateService = async (id, serviceData) => {
  const { name, price, description, status } = serviceData;

  const query = `
    UPDATE services 
    SET service_name = $1, price = $2, description = $3, status = $4
    WHERE id = $5
    RETURNING *
  `;

  const values = [name, price, description || null, status || 'active', id];
  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteService = async (id) => {
  const query = `
    DELETE FROM services 
    WHERE id = $1
    RETURNING *
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
