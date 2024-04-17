import express, { Request, Response } from 'express';
import routes from './routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Default port 3000 if not provided in .env file

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World');
});

app.use('/api', routes);

export default app;
