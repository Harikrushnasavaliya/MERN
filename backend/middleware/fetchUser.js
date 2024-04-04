const jwt = require('jsonwebtoken');
const JWT_Secret = "Humpe to he hi na";

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_Secret);
        req.user = {
            id: data.user.id
            // userType: data.user.userType 
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchUser;
