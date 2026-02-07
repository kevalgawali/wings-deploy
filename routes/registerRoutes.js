const express = require("express")
const odeToCode = require("../components/registerFunctions/odeToCode")
const doctorFixIt = require("../components/registerFunctions/doctorFixIt")
const codeVibes = require("../components/registerFunctions/codeVibes")
const room404 = require("../components/registerFunctions/room404")
const dronix = require("../components/registerFunctions/dronix")
const innovex = require("../components/registerFunctions/innovex")
const roboRace = require("../components/registerFunctions/roboRace")
const lineFollower = require("../components/registerFunctions/lineFollower")
const roboSoccer = require("../components/registerFunctions/roboSoccer")
const roboSumo = require("../components/registerFunctions/roboSumo")
const eArenaChampionshipBgmi = require("../components/registerFunctions/eArenaChampionshipBgmi")
const eArenaChampionshipFreeFire = require("../components/registerFunctions/eArenaChampionshipFreeFire")
const cadClash = require("../components/registerFunctions/cadClash")
const mechathon = require("../components/registerFunctions/mechathon")
const bridgeIt = require("../components/registerFunctions/bridgeIt")
const quizOMania = require("../components/registerFunctions/quizOMania")
const router = express.Router()

router.use(express.json());

// CSE Events
router.post("/ode-to-code",odeToCode)
router.post("/doctor-fix-it",doctorFixIt)

// IT Events
router.post("/code-vibes",codeVibes)
router.post("/room-404",room404)

// ENTC Events
router.post("/dronix",dronix)
router.post("/innovex",innovex)

// EC Events
router.post("/robo-race",roboRace)
router.post("/line-follower",lineFollower)
router.post("/robo-soccer",roboSoccer)
router.post("/robo-sumo",roboSumo)
router.post("/e-arena-championship-bgmi",eArenaChampionshipBgmi)
router.post("/e-arena-championship-free-fire",eArenaChampionshipFreeFire)

// ME Events
router.post("/cad-clash",cadClash)
router.post("/mechathon",mechathon)

// CE Events
router.post("/bridge-it",bridgeIt)
router.post("/quiz-o-mania",quizOMania)

module.exports = router