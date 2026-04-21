import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true 
    },
    content: { 
        type: String, 
        required: true 
    }, // Stores HTML from the Rich Text Editor
    excerpt: { 
        type: String, 
        trim: true 
    }, // Short summary for the blog listing cards
    author: { 
        type: String, 
        required: true,
        default: 'Admin'
    },
    featured_image: { 
        type: String, 
        required: true 
    }, // Cloudinary URL
    tags: [{ 
        type: String,
        trim: true 
    }],
    status: { 
        type: String, 
        enum: ['draft', 'published'], 
        default: 'draft' 
    },
    read_time: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true
});

// Indexing for faster searches
blogSchema.index({ title: 'text', tags: 'text' });

const Blog = mongoose.model('Blogs', blogSchema);
export default Blog;