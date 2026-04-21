import Blog from "../models/blogModel.js";
import {
    uploadToCloudinary,
    deleteFromCloudinary,
    extractPublicId,
    getResourceType
} from "../utils/cloudinaryHelper.js";

// Helper to generate SEO friendly slugs
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start
        .replace(/-+$/, '');            // Trim - from end
};

// @desc    Create a new blog post
const addBlogPost = async (req, res) => {
    try {
        const { title, content, excerpt, author, tags, status, read_time } = req.body;
        const file = req.file;

        if (!title || !content || !file) {
            return res.status(400).json({ status: false, message: "Title, content, and featured image are required" });
        }

        // Generate unique slug
        let slug = generateSlug(title);
        const slugExists = await Blog.findOne({ slug });
        if (slugExists) {
            slug = `${slug}-${Date.now()}`;
        }

        // Upload image to Cloudinary
        const resourceType = getResourceType(file.mimetype);
        const uploadResult = await uploadToCloudinary(file.buffer, 'blogs', resourceType);

        const blogData = {
            title,
            slug,
            content,
            excerpt,
            author,
            read_time,
            status,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            featured_image: uploadResult.secure_url
        };

        const newBlog = new Blog(blogData);
        await newBlog.save();

        res.status(201).json({ status: true, message: "Blog post published successfully", data: newBlog });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error adding blog post", error: error.message });
    }
};

// @desc    Get all blog posts (Admin gets all, Customer gets only published)
const getBlogPosts = async (req, res) => {
    try {
        const { role } = req.query; // Optional: filter by status if not admin
        const query = (role === 'admin' || role === 'superadmin') ? {} : { status: 'published' };
        
        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        res.status(200).json({ status: true, data: blogs });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching blogs", error: error.message });
    }
};

// @desc    Get single blog post by slug
const getBlogPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ status: false, message: "Blog post not found" });
        }

        res.status(200).json({ status: true, data: blog });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching blog post", error: error.message });
    }
};

// @desc    Update blog post
const updateBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, tags, ...updateData } = req.body;
        const file = req.file;

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ status: false, message: "Blog post not found" });

        if (file) {
            // Delete old image
            const publicId = extractPublicId(blog.featured_image);
            if (publicId) await deleteFromCloudinary(publicId, 'image');

            // Upload new image
            const uploadResult = await uploadToCloudinary(file.buffer, 'blogs', 'image');
            updateData.featured_image = uploadResult.secure_url;
        }

        if (title) updateData.slug = generateSlug(title);
        if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());

        const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        res.status(200).json({ status: true, message: "Blog updated successfully", data: updatedBlog });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error updating blog", error: error.message });
    }
};

// @desc    Delete blog post
const deleteBlogPost = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) return res.status(404).json({ status: false, message: "Blog post not found" });

        // Cleanup Cloudinary
        const publicId = extractPublicId(blog.featured_image);
        if (publicId) await deleteFromCloudinary(publicId, 'image');

        res.status(200).json({ status: true, message: "Blog post deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error deleting blog", error: error.message });
    }
};

export {
    addBlogPost,
    getBlogPosts,
    getBlogPostBySlug,
    updateBlogPost,
    deleteBlogPost
};