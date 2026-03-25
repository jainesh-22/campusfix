const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let complaints = [];


/* 🔐 Admin (fake DB) */
const adminUser = {
    username: "admin",
    password: "1234"
};


/* 🔐 Login API */
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === adminUser.username && password === adminUser.password) {

        res.json({ token: "securetoken123" });

    } else {

        res.status(401).json({ message: "Invalid credentials" });

    }

});


/* 🔐 Middleware */
function verifyToken(req, res, next) {

    const token = req.headers["authorization"];

    if (token === "securetoken123") {

        next();

    } else {

        res.status(403).json({ message: "Unauthorized ❌" });

    }

}


/* Submit Complaint */
app.post("/submit", (req, res) => {

    const complaint = {

        name: req.body.name,
        roll: req.body.roll,
        problem: req.body.problem,
        location: req.body.location,
        description: req.body.description,
        status: "Pending"

    };

    complaints.push(complaint);

    res.json({ message: "Submitted" });

});


/* Get Complaints */
app.get("/complaints", (req, res) => {

    res.json(complaints);

});


/* Delete */
app.delete("/delete/:index", verifyToken, (req, res) => {

    complaints.splice(req.params.index, 1);

    res.json({ message: "Deleted" });

});


/* Resolve */
app.put("/resolve/:index", verifyToken, (req, res) => {

    if (complaints[req.params.index]) {

        complaints[req.params.index].status = "Resolved";

    }

    res.json({ message: "Resolved" });

});


/* Start Server */
app.listen(3000, () => {

    console.log("Server running on port 3000");

});