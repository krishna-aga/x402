const db = require("../models/db");
 async function checkApi(req, res, next) {
    try {
        const { Id } = req.params;
        const api = await db.Api.findOne({ apiId: Id });
        if (!api) {
            return res.status(404).json({ error: "API not found" });
        }
        res.locals.api = api;
        console.log("api", api);
    

        next();
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
module.exports = { checkApi };