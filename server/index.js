import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import connectDB from './config/connectDB.js';

import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';
import newsRouter from './route/news.route.js';

dotenv.config();

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL_LOCAL,
    process.env.FRONTEND_URL_PROD
];

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS not allowed for this origin: ' + origin));
        }
    }
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({
        message: `Server is running on port ${PORT}`
    });
});

// API routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/news', newsRouter);

// Connect to DB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
