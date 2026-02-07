const express = require("express")
const login = require("../components/auth/login")
const logOut = require("../components/auth/logOut")
const { checkEventRegistrationStatus, checkViewerRegistrationStatus } = require("../components/checkRegistrationStatus")
const router = express.Router()

router.use(express.static("dist"))
router.use(express.json());

router.get("*", (req, res) => {
    res.sendFile("index.html", { root: "dist" })
})

router.post("/login", login)

router.post("/logout", logOut)

// Public registration status check endpoints
router.post("/check-event-registration", checkEventRegistrationStatus)
router.post("/check-viewer-registration", checkViewerRegistrationStatus)

module.exports = router
