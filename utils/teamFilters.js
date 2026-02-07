const isNumberInRange = (num, min, max) => {
    return num >= min && num <= max;
}

const filters = (req, res, filterConfig) => {
    try {
        let femaleCount = 0;
        const { teamName, utr, members, leader } = req.body
        // checking blank fields on higher level
        if (!teamName) {
            console.log("Team name is required")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Team name is required"
            })
            return false
        }
        if(!leader){
            console.log("Leader is required")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Leader is required"
            })
            return false
        }
        if(!members){
            console.log("Members are required")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Members are required"
            })
            return false
        }

        if(typeof(utr) != "string" || utr.length != 12){
            console.log("UTR length should be 12")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "UTR length should be exactly 12 characters"
            })
            return false
        }

        // checking blank fields on lower level

        //leaders field validation
        if(!(leader.name  && leader.gender && leader.branch && leader.phone && leader.email && leader.college)){
            console.log("Invalid Leaders Data")
            console.log(leader)
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Invalid leader data - all fields (name, gender, branch, phone, email, college) are required"
            })
            return false
        }
        if(typeof(leader.name) != "string" || typeof(leader.gender) != "string" || typeof(leader.branch) != "string" || typeof(leader.phone) != "string" || typeof(leader.email) != "string" || typeof(leader.college) != "string" ){
            console.log("Leader data is invalid")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Invalid leader data types - all fields must be strings"
            })
            return false
        }
        if(leader.gender === 'F') femaleCount++;

        //members field validation 
        if (!(isNumberInRange(Object.keys(members).length+1, filterConfig.minMembers, filterConfig.maxMembers))) {
            console.log("Team size is invalid")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: `Team size must be between ${filterConfig.minMembers} and ${filterConfig.maxMembers} members`
            })
            return false
        }

        let isMemeberValid=true
        // checking female members and detecting blank fields
        Object.values(members).forEach(member => {
            if (member.gender === "F") {   //female count
                femaleCount++;
            }
            if (!(member.name && member.gender && member.phone)) {   //detecting blank fields
                console.log("Member data is invalid")
                isMemeberValid=false
            }
            if(typeof(member.name) != "string" || typeof(member.gender) != "string" || typeof(member.phone) != "string" ){
                console.log("Member data is invalid")
                isMemeberValid=false
            }
        });

        if(!isMemeberValid){
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: "Invalid member data - all members must have name, gender, and phone (all as strings)"
            })
            return false
        }
        // validating count of female candidates
        if (femaleCount < filterConfig.minFemale) {
            console.log("Female members count is invalid")
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: `At least ${filterConfig.minFemale} female member(s) required`
            })
            return false
        }

        return true
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: "Server encountered an unexpected error during validation"
        })
        return false
    }
}

module.exports = filters;
