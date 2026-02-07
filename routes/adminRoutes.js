const express = require("express")
const paymentStatusUpdate = require("../components/admin/paymentStatusUpdate")
const adminDashboard = require("../components/admin/adminDashboard")
const listTeams = require("../components/admin/listTeams")
const getTeamDetails = require("../components/admin/getTeamDetails")
const { getTeamsForRanking, assignRank, getRankings } = require("../components/admin/rankings")
const { getRegistrationStatus, toggleRegistrationStatus } = require("../components/admin/registrationStatus")
const router = express.Router()

router.use(express.json());

// Dashboard routes
router.post("/dashboard", adminDashboard)

// Team management routes
router.post("/list-teams", listTeams)
router.post("/team-details", getTeamDetails)
router.post("/update-payment-status", paymentStatusUpdate)

// Ranking routes
router.post("/rankings/teams", getTeamsForRanking)
router.post("/rankings/assign", assignRank)
router.post("/rankings/list", getRankings)

// Registration status routes
router.post("/registration-status", getRegistrationStatus)
router.post("/toggle-registration", toggleRegistrationStatus)

module.exports = router
