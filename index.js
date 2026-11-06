require("dotenv").config();
const express = require('express')
const app = express()
const db = require('./models/db')
const registerApiRoutes = require('./routes/registerApi')
const apiGatewayRoutes = require("./routes/gatewayApi");
const cors = require("cors");
const statsRoutes = require("./routes/Stats");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

db.connectDB();

app.get('/', (req, res) => {
  res.send('hello world')
})

app.use('/api', registerApiRoutes);   
app.use("/api", statsRoutes);          
app.use("/api", apiGatewayRoutes);     

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
