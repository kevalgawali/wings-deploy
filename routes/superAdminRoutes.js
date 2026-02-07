const express = require("express")
const makeAdmins = require("../components/superAdmin/makeAdmins")
const changeAdminPasswords = require("../components/superAdmin/changeAdminPasswords")
const listAdmins = require("../components/superAdmin/listAdmins")
const deleteAdmin = require("../components/superAdmin/deleteAdmin")
const getEvents = require("../components/superAdmin/getEvents")
const getAllTeams = require("../components/superAdmin/getAllTeams")
const router = express.Router()

router.use(express.json())

// Admin management routes
router.post("/make-admins", makeAdmins)
router.post("/change-admin-password", changeAdminPasswords)
router.post("/list-admins", listAdmins)
router.post("/delete-admin", deleteAdmin)

// Event routes
router.post("/get-events", getEvents)
router.post("/get-all-teams", getAllTeams)

module.exports = router