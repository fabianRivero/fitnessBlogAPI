import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const blogSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4,  required: true, unique: true },
    title: { type: String, required: true }, 
    linkTitle: { type: String, required: true },     
    description: { type: String, required: true },
    publicationDate: { type: String, default: `${+new Date().getDate()}/${+new Date().getMonth()+1}/${+new Date().getFullYear()}`, required: true },
    tags: {type: Array, required: true },
    cardImage: {type: String, required: true },
    content: { type: String, required: true },
    extendedDate: { type: Date, default: new Date(), required: true },
    usersComments: {type: Array, required: true},
    usersLikes: {type: Array, required: true}
}, 
{
    toJSON: {
        transform: function(doc, ret){
            delete ret.__v;
            delete ret._id;
        },
        virtuals: true,
    },
    }
);

blogSchema.index({ id: 1, title: 1 });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
