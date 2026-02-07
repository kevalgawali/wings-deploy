const logOut = (req, res) => {
    try{
        res.clearCookie("token");
        res.send("Logged out successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = logOut;