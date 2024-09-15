import express from "express";
import fs from 'fs';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const port = 3000;

const readData = () => {
    try {
        const data = fs.readFileSync('./db.json');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};


const writeData = (data) => {
    try {
        fs.writeFileSync('./db.json', JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

app.get('/', (req, res) =>{
    res.send('My first API blog')
});

//para obtener todos los blogs
app.get('/blogs', (req, res) => {
    const data = readData();
    res.json(data.blogs);
})

//para obtener un blog en especifico
app.get("/blogs/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const blog = data.blogs.find((blog) => blog.id === id);
    res.json(blog);
})

//para crear un nuevo blog
app.post("/blogs", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBlog = {
        id: data.blogs.length + 1,
        ...body,
    };
    data.blogs.push(newBlog);
    writeData(data);
    res.json(newBlog);
});

//para editar un blog existente
app.put('/blogs/:id', (req, res) => {
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
app.delete('/blogs/:id', (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const blogIndex = data.blogs.findIndex((blog) => blog.id === id);
    data.blogs.splice(blogIndex, 1);
    writeData(data);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});