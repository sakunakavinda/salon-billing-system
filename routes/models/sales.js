const pool = require("../../db");

const createSale = async (saleData) => {
  const { customerName, customerTp, services, totalAmount, cashierId, date } =
    saleData;

  // Start a database transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Insert into sales table
    const saleResult = await client.query(
      "INSERT INTO sales (cashier_id, total_amount, customer_name, customer_tp, sale_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        cashierId,
        totalAmount,
        customerName,
        customerTp,
        date ? new Date(date) : null,
      ],
    );

    const saleId = saleResult.rows[0].id;

    // Fetch service prices for the given service IDs
    const serviceResult = await client.query(
      "SELECT id, price FROM services WHERE id = ANY($1)",
      [services],
    );

    // Insert into sale_items table for each service
    for (const service of serviceResult.rows) {
      await client.query(
        "INSERT INTO sale_items (sale_id, service_id, service_price) VALUES ($1, $2, $3)",
        [saleId, service.id, service.price],
      );
    }

    await client.query("COMMIT");
    return saleResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getSalesByCashier = async (cashierId, dateFilter = "today", specificDate = null) => {
  let whereClause = "WHERE s.cashier_id = $1";
  let queryParams = [cashierId];
  let paramIndex = 2;

  // Add date filtering logic with proper validation
  if (dateFilter === "custom" && specificDate) {
    whereClause += ` AND DATE(s.sale_date) = $${paramIndex}`;
    queryParams.push(specificDate);
    paramIndex++;
  } else if (dateFilter === "today") {
    whereClause += ` AND DATE(s.sale_date) = CURRENT_DATE`;
  } else if (dateFilter === "this_week") {
    whereClause += ` AND EXTRACT(WEEK FROM s.sale_date) = EXTRACT(WEEK FROM CURRENT_DATE) 
                     AND EXTRACT(YEAR FROM s.sale_date) = EXTRACT(YEAR FROM CURRENT_DATE)`;
  } else if (dateFilter === "this_month") {
    whereClause += ` AND EXTRACT(MONTH FROM s.sale_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
                     AND EXTRACT(YEAR FROM s.sale_date) = EXTRACT(YEAR FROM CURRENT_DATE)`;
  } else {
    // Default to today's records if dateFilter is invalid or not provided
    whereClause += ` AND DATE(s.sale_date) = CURRENT_DATE`;
  }

  // Query to get individual sales with their details
  const salesQuery = `
    SELECT s.id, s.total_amount, s.customer_name, s.customer_tp, s.sale_date, u.username AS cashier_name,
      json_agg(json_build_object('service_id', si.service_id, 'service_price', si.service_price, 'name', srv.service_name)) AS services
    FROM sales s
    JOIN users u ON s.cashier_id = u.id
    JOIN sale_items si ON s.id = si.sale_id
    LEFT JOIN services srv ON si.service_id = srv.id
    ${whereClause}
    GROUP BY s.id, u.username
    ORDER BY s.sale_date DESC
  `;

  // Query to get aggregated totals
  const totalsQuery = `
    SELECT 
      COALESCE(SUM(s.total_amount), 0) AS total_sales_amount,
      COUNT(s.id) AS transaction_count
    FROM sales s
    ${whereClause}
  `;

  // Execute both queries
  const [salesResult, totalsResult] = await Promise.all([
    pool.query(salesQuery, queryParams),
    pool.query(totalsQuery, queryParams),
  ]);

  // Return combined result
  return {
    totalSalesAmount: totalsResult.rows[0].total_sales_amount,
    transactionCount: totalsResult.rows[0].transaction_count,
    sales: salesResult.rows,
  };
};

const getAllSales = async (dateFilter = "today", specificDate = null) => {
  let whereClause = "";
  let queryParams = [];

  // Apply date filtering
  if (dateFilter === "custom" && specificDate) {
    whereClause = "WHERE DATE(s.sale_date) = $1";
    queryParams.push(specificDate);
  } else if (dateFilter === "today") {
    whereClause = "WHERE DATE(s.sale_date) = CURRENT_DATE";
  } else if (dateFilter === "this_week") {
    whereClause = `WHERE EXTRACT(WEEK FROM s.sale_date) = EXTRACT(WEEK FROM CURRENT_DATE) 
                   AND EXTRACT(YEAR FROM s.sale_date) = EXTRACT(YEAR FROM CURRENT_DATE)`;
  } else if (dateFilter === "this_month") {
    whereClause = `WHERE EXTRACT(MONTH FROM s.sale_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
                   AND EXTRACT(YEAR FROM s.sale_date) = EXTRACT(YEAR FROM CURRENT_DATE)`;
  }
  // If no dateFilter or invalid, return all records (current behavior)

  const query = `
    SELECT s.id, s.total_amount, s.customer_name, s.customer_tp, s.sale_date, u.username AS cashier_name,
      json_agg(json_build_object('service_id', si.service_id, 'service_price', si.service_price, 'name', srv.service_name)) AS services
    FROM sales s
    JOIN users u ON s.cashier_id = u.id
    JOIN sale_items si ON s.id = si.sale_id
    LEFT JOIN services srv ON si.service_id = srv.id
    ${whereClause}
    GROUP BY s.id, u.username
    ORDER BY s.sale_date DESC
  `;

  const result = await pool.query(query, queryParams);
  return result.rows;
};



module.exports = {
  createSale,
  getAllSales,
  getSalesByCashier,
};
