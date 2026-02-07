const filters = require("../../utils/teamFilters")
const teamInsertionQuery = require("../../utils/querys/teamInsertion")
const { handleRegistrationError } = require("../../utils/errorHandler");

const dronix = async(req,res) => {
    try{
        const {teamName,utr,leader,members} = req.body
        const filterConfig = {
            minMembers: 1,
            maxMembers: 5,
            minFemale: 0
        }
        const filterStatus= filters(req,res,filterConfig)
        if(!filterStatus){
            return
        }
        const registrationId = await teamInsertionQuery("Dronix",teamName, utr,leader, members)
        if(!registrationId){
            return res.status(400).json({
                success: false,
                message: "Team registration failed",
                error: "Unable to insert team data"
            })
        }
        res.status(201).json({
            success: true,
            message: "Dronix registered successfully",
            data: {
                registrationId: registrationId,
                teamName: teamName,
                event: "Dronix"
            }
        })
    } catch (error) {
        handleRegistrationError(error, res, "Dronix");
    }
}

module.exports = dronix