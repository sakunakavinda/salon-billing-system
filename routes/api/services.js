const express = require("express");
const router = express.Router();
const {
  createService,getAllServices,getServiceById,updateService,deleteService,} = require("../models/services");

// POST /api/admin/services - Create new service
router.post("/", async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const newService = await createService({
      name,
      price,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: newService,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create service",
    });
  }
});

//get all services
router.get("/", async (req, res) => {
  try {
    const services = await getAllServices();

    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const { name, price, description, status } = req.body;

    const updatedService = await updateService(serviceId, {
      name,
      price,
      description,
      status,
    });

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;

    const deletedService = await deleteService(serviceId);

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service",
    });
  }
});

module.exports = router;
