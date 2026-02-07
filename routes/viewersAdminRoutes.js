const express = require("express")
const getViewerStats = require("../components/viewersAdmin/getViewerStats")
const listViewers = require("../components/viewersAdmin/listViewers")
const deleteViewer = require("../components/viewersAdmin/deleteViewer")
const updatePayment = require("../components/viewersAdmin/updatePayment")
const { getViewerRegistrationStatus, toggleViewerRegistrationStatus } = require("../components/viewersAdmin/registrationStatus")
const router = express.Router()

router.use(express.json())

// Viewers Admin routes
router.post("/stats", getViewerStats)
router.post("/list", listViewers)
router.post("/delete", deleteViewer)
router.post("/update-payment", updatePayment)

// Registration status routes
router.post("/registration-status", getViewerRegistrationStatus)
router.post("/toggle-registration", toggleViewerRegistrationStatus)

module.exports = router
