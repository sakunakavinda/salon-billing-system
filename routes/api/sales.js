const express = require('express');
const router = express.Router();
const { createSale, getAllSales, getSalesByCashier } = require("../models/sales");

// POST /api/cashiers/sales - Create new sale
router.post("/", async (req, res) => {
  try {
    const { customerName, customerTp, services, date, totalAmount, cashierId } = req.body;

    // Create new sale
    const newSale = await createSale({
      customerName,
      customerTp,
      services,
      date,
      totalAmount,
      cashierId,
    });

    res.status(201).json({
      success: true,
      message: "Sale recorded successfully",
      data: newSale,
    });
  } catch (error) {
    console.error("Error recording sale:", error);
    res.status(500).json({
      success: false,
      message: "Failed to record sale",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const cashierId = req.query.cashierId;
    const dateFilter = req.query.dateFilter || "today";
    const specificDate = req.query.specificDate;

    let response;
    if (cashierId) {
      // Filter by specific cashier - now returns aggregated data
      response = await getSalesByCashier(cashierId, dateFilter, specificDate);

      res.json({
        filter: dateFilter,
        success: true,
        data: response.sales, // Individual sales array
        totalSalesAmount: response.totalSalesAmount, // New: Server-calculated total
        transactionCount: response.transactionCount, // New: Server-calculated count
      });
    } else {
      // Get all sales (for admin use) with date filtering
      const sales = await getAllSales(dateFilter, specificDate);
      const totalSalesAmount = sales.reduce((sum, sale) => {
        return sum + parseFloat(sale.total_amount);
      }, 0);
      
      res.json({
        filter: dateFilter,
        success: true,
        data: sales,
        totalSalesAmount: totalSalesAmount,
        transactionCount: sales.length,
      });
    }
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales",
    });
  }
});





module.exports = router;
