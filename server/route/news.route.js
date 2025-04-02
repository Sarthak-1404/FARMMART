import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createNewsController, deleteNewsDetails, getNewsByCategory, getNewsController, getNewsDetails, updateNewsDetails } from '../controllers/news.controller.js';
import { admin } from '../middleware/Admin.js';

const newsRouter = Router();

// Create news
newsRouter.post('/create', auth, admin, createNewsController);

// Get all news
newsRouter.get('/get', getNewsController);

// Get news by category
newsRouter.post('/get-news-by-category', getNewsByCategory);

// Get news details
newsRouter.post('/get-news-details', getNewsDetails);

// Update news
newsRouter.put('/update-news-details', auth, admin, updateNewsDetails);

// Delete news
newsRouter.delete('/delete-news', auth, admin, deleteNewsDetails);

export default newsRouter;
