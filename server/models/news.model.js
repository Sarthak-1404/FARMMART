import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: Array,
        default: []
    },
    category: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'category'
        }
    ],
    tags: {
        type: [String],
        default: []
    },
    author: {
        type: String,
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create a text index for efficient search
newsSchema.index({
    title: 'text',
    content: 'text',
    tags: 'text'
}, {
    title: 10,
    content: 5,
    tags: 2
});

const NewsModel = mongoose.model('news', newsSchema);

export default NewsModel;
