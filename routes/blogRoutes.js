import express from 'express';
import Blog from '../models/blog.js';

const router = express.Router();

//para obtener todos los blogs
router.get('/blogs', (req, res) => {
    const data = readData();
    res.json(data.blogs);
})

//para obtener un blog en especifico
router.get("/blogs/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const blog = data.blogs.find((blog) => blog.id === id);
    res.json(blog);
})

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
    } catch (error) {
        res.status(500).send('something went wrong.', error);
    };

    res.status(201).send({ blog: {
        title: blog.title,
        publicationDate: blog.publicationDate
    }});
});

//para editar un blog existente
router.put('/blogs/:id', (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const blogIndex = data.blogs.findIndex((blog) => blog.id === id);
    data.blogs[blogIndex] = {
        ...data.blogs[blogIndex],
        ...body,
    };
    writeData(data);
    res.json({message: 'Blog updated successfully'})
});

//para borrar un blog existente
router.delete('/blogs/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const blogIndex = data.blogs.findIndex((blog) => blog.id === id);
    data.blogs.splice(blogIndex, 1);
    writeData(data);
    res.json({ message: 'Book deleted successfully' });
});

export default router;