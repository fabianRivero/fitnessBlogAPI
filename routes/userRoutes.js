import express from 'express';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from '../models/User.js';

const router = express.Router();

//para el signup del usuario
// POST api/users/signup
router.post("/users/signup", async (req, res) =>{
    let user;
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered.');

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.aborted.role
    });

    try {
        await user.save();

        const token = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        
        res.header("Authorization", token).send({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        res.status(500).send("Somthin went wrong");
    }
});

//POST api/users/login
router.post("/users/login", async(req, res) =>{
    let user;
    user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');


    try {
        const token = jwt.sign({
            id: user.id,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        
        res.header("Authorization", token).send({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });

    } catch (error) {
        res.status(500).send("Somthin went wrong");
    }
});


//para obtener todos los usuarios
router.get('/users/', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({users: users});    
    } catch (error) {
        res.status(500).send({ message: "Server Error " + error.message });
    }
});

//para obtener un blog en especifico
router.get("/users/:id", async (req, res) => {
try {
    //const blog = await Blog.findById(req.params.id); este metodo usa el id de mongoose
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: user })
} catch (error) {
    res.status(500).json({ message: "Server error " + error.message })
}
});

//para editar un blog existente
router.put('/users/:id', async (req, res) => {
    const updates = req.body;
    try {
        const user = await User.findOneAndUpdate({ email: req.params.email }, updates, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user: user });
    } catch (error) {
        res.status(500).json({ message: "Server error " + error.message });
    }
});

//para borrar un blog existente
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: user });
    } catch (error) {
        res.status(404).json({ message: "Server error " + error.message });
    }
});

export default router;
