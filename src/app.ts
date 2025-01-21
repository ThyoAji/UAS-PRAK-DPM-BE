import express from 'express';
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import foodRoutes from './routes/foodRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/foods', foodRoutes);
app.use('/profile', profileRoutes);

export default app;
