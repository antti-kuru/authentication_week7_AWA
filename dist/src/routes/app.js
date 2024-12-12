"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken_1 = require("../middleware/validateToken");
const router = (0, express_1.Router)();
const users = [];
router.post("/api/user/register", (0, express_validator_1.body)("email").trim().isLength({ min: 3 }).escape(), (0, express_validator_1.body)("password").isLength({ min: 5 }), async (req, res) => {
    try {
        const existingUser = users.find(user => user.email === req.body.email);
        if (existingUser) {
            res.status(403).json({ message: "Error registering" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        const newUser = {
            email: req.body.email,
            password: hash
        };
        console.log(newUser);
        users.push(newUser);
        console.log("User created succesfully");
        res.status(200).json(newUser);
        console.log(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
});
router.get("/api/user/list", (req, res) => {
    try {
        if (users.length < 1) {
            res.status(403).json({ message: "No users" });
            return;
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/api/user/login", (0, express_validator_1.body)("email").trim().escape(), (0, express_validator_1.body)("password").escape(), async (req, res) => {
    try {
        const existingUser = users.find(user => user.email === req.body.email);
        if (!existingUser) {
            res.status(403).json({ message: "Error logging in" });
        }
        else {
            if (bcrypt_1.default.compareSync(req.body.password, existingUser.password)) {
                const jwtPayload = {
                    email: existingUser.email
                };
                const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "10m" });
                res.status(200).json({ success: true, token });
            }
            else {
                res.status(401).json({ message: "Login failed" });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.log(error);
    }
});
router.get("/api/private", validateToken_1.validateToken, (req, res) => {
    res.status(200).json({ message: "This is protected secure route!" });
});
exports.default = router;
