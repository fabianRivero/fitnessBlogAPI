import express from 'express';
import Blog from '../models/Blog.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';

const router = express.Router();

//para obtener todos los blogs
router.get('/blogs', async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 10;
    const page = parseInt(req.query.page) || 1;

    try {
        const blogs = await Blog.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
        const total = await Blog.countDocuments();

        res.status(200).json({
            blogs,
            page,
            pages: Math.ceil(total / pageSize),
            currentPage: page,
    });    
    } catch (error) {
        res.status(500).send({ message: "Server Error " + error.message });
    }
});

//para obtener un blog en especifico
router.get("/blogs/:id", async (req, res) => {
try {
    const blog = await Blog.findOne({ id: req.params.id });
    if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ blog: blog })
} catch (error) {
    res.status(500).json({ message: "Server error " + error.message })
}
});

//para crear un nuevo blog
//POST api/blogs/all-blogs
router.post("/blogs", [auth, admin], async (req, res) => {
    let blog;
    blog = new Blog({
        id: req.user.id,
        title: req.body.title,
        linkTitle: req.body.linkTitle,
        description: req.body.description,
        publicationDate: req.body.publicationDate,
        tags: req.body.tags,
        cardImage: req.body.cardImage,
        content: req.body.content,
        extendedDate: req.body.extendedDate
    });
    try {
        await blog.save();
        res.status(200).json({ blog: blog });
    } catch (error) {
        res.status(500).send('something went wrong.', error);
    };
});

//para editar un blog existente
router.put('/blogs/:id', [auth, admin], async (req, res) => {
    const updates = req.body;
    try {
        const blog = await Blog.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ blog: blog });
    } catch (error) {
        res.status(500).json({ message: "Server error " + error.message });
    }
});

//para borrar un blog existente
router.delete('/blogs/:id', [auth, admin], async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ id: req.params.id });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ blog: blog });
    } catch (error) {
        res.status(404).json({ message: "Server error " + error.message });
    }
});

//para comentar o calificar un blog
router.patch('/blogs/:id', [auth], async (req, res) => {
    const updates = req.body;
    try {
        const blog = await Blog.findOneAndUpdate({ id: req.params.id }, updates, { new: true });
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ blog: blog });
    } catch (error) {
        res.status(500).json({ message: "Server error " + error.message });
    }
});

export default router;