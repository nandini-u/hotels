import express from 'express';
import Person from '../Models/person.js';

const router = express.Router();

router.post('/person', async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new Person(data);
    const person = await newPerson.save();
    res.status(200).json(person);
  } catch (err) {
    console.error('Error saving person', err);

    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate email address' });
    }

    if (err?.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Error saving person' });
  }
});

router.get('/person', async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (err) {
    console.error('Error fetching persons', err);
    res.status(500).json({ error: 'Error fetching persons' });
  }
});

router.get('/person/:workType', async (req, res) => {
  const workType = req.params.workType;
  if (workType === 'chef' || workType === 'waiter' || workType === 'manager') {
    try {
      const persons = await Person.find({ work: workType });
      res.status(200).json(persons);
    } catch (err) {
      console.error('Error fetching persons', err);
      res.status(500).json({ error: 'Error fetching persons' });
    }
  } else {
    res.status(400).json({ error: 'Invalid work type' });
  }
});
router.put('/person/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedData = req.body;
    const person = await Person.findByIdAndUpdate(personId, updatedData, { new: true, runValidators: true });
    res.status(200).json(person);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
  } catch (err) {
    console.error('Error updating person', err);
    res.status(500).json({ error: 'Error updating person' });
  }
});
router.delete('/person/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findByIdAndDelete(personId);
    res.status(200).json(person);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
  } catch (err) {
    console.error('Error deleting person', err);
    res.status(500).json({ error: 'Error deleting person' });
  }
});
export default router;