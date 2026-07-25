import express from 'express';
import MenuItem from '../Models/MenuItem.js';

const router = express.Router();

router.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items', err);
    res.status(500).json({ error: 'Error fetching menu items' });
  }
});

router.post('/menuitem', async (req, res) => {
  try {
    const data = req.body;
    const newMenuItem = new MenuItem(data);
    const menuItem = await newMenuItem.save();
    res.status(200).json(menuItem);
  } catch (err) {
    console.error('Error saving menu item', err);
    res.status(500).json({ error: 'Error saving menu item' });
  }
});

router.put('/menuitem/:id', async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const updatedData = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(menuItemId, updatedData, { new: true, runValidators: true });
    res.status(200).json(menuItem);
  } catch (err) {
    console.error('Error updating menu item', err);
    res.status(500).json({ error: 'Error updating menu item' });
  }
});

router.delete('/menuitem/:id', async (req, res) => {
  try {
    const menuItemId = req.params.id;
    const menuItem = await MenuItem.findByIdAndDelete(menuItemId);
    res.status(200).json(menuItem);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
  } catch (err) {
    console.error('Error deleting menu item', err);
    res.status(500).json({ error: 'Error deleting menu item' });
  }
});
// added the validation for the menu item schema to ensure that the price is a positive number and the name is not empty
export default router;