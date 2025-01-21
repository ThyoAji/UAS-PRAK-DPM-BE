import express, { Request, Response } from 'express';
import { User } from '../models/User';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req as any;

    if (!userId) {
      res.status(400).json({ error: 'User ID not found in request' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
