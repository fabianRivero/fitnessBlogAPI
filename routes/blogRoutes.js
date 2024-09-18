import express from 'express';
import Blog from '../models/blog.js';

const router = express.Router();

//para obtener todos los blogs
router.get('/all-blogs', async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json({blogs: blogs});    
    } catch (error) {
        res.status(500).send({ message: "Server Error " + error.message });
    }
});

//para obtener un blog en especifico
router.get("/:id", async (req, res) => {
try {
    //const blog = await Blog.findById(req.params.id); este metodo usa el id de mongoose
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
//POST api/blogs/new-blog
router.post("/new-blog", async (req, res) => {
    let blog;
    blog = new Blog({
        id: req.body.id,
        title: req.body.title,
        //description: req.body.description,
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

    res.status(201).send({ blog: {
        title: blog.title,
        publicationDate: blog.publicationDate
    }});
});

//para editar un blog existente
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

export default router;