import express, { Request, Response } from 'express';
import { Food } from '../models/Food';
import authenticateToken from '../middleware/authenticateToken';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId;

  try {
    const foods = await Food.find({ ownerId: userId });
    res.json(foods);
  } catch (err) {
    console.error('Error fetching food items:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, price, description } = req.body;
  const userId = req.userId;

  if (!name || !price || !description) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const newFood = new Food({ name, price, description, ownerId: userId });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    console.error('Error saving food item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const userId = req.userId;

  if (!name || !price || !description) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const updatedFood = await Food.findOneAndUpdate(
      { _id: id, ownerId: userId },
      { name, price, description },
      { new: true }
    );

    if (!updatedFood) {
      res.status(404).json({ error: 'Food item not found or unauthorized' });
      return;
    }

    res.json(updatedFood);
  } catch (err) {
    console.error('Error updating food item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const food = await Food.findOneAndDelete({ _id: id, ownerId: userId });
    if (!food) {
      res.status(404).json({ error: 'Food item not found or unauthorized' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
