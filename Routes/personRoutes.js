import express from 'express';
import Person from '../Models/person.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const normalizedEmail = data?.email ? String(data.email).trim().toLowerCase() : '';

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const existingPerson = await Person.findOne({ email: normalizedEmail });
    if (existingPerson) {
      return res.status(409).json({
        error: 'Duplicate email address',
        message: 'A person with this email already exists. Use PUT with the existing ID to update the record.'
      });
    }

    const newPerson = new Person({ ...data, email: normalizedEmail });
    const person = await newPerson.save();
    res.status(201).json(person);
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

router.get('/', async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json(persons);
  } catch (err) {
    console.error('Error fetching persons', err);
    res.status(500).json({ error: 'Error fetching persons' });
  }
});

router.get('/:workType', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const updatedData = { ...req.body };

    if (updatedData?.email) {
      updatedData.email = String(updatedData.email).trim().toLowerCase();
      const duplicatePerson = await Person.findOne({ email: updatedData.email, _id: { $ne: personId } });
      if (duplicatePerson) {
        return res.status(409).json({
          error: 'Duplicate email address',
          message: 'Another person already uses this email address.'
        });
      }
    }

    const person = await Person.findByIdAndUpdate(personId, updatedData, { new: true, runValidators: true });
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    res.status(200).json(person);
  } catch (err) {
    console.error('Error updating person', err);
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Duplicate email address' });
    }
    res.status(500).json({ error: 'Error updating person' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const personId = req.params.id;
    const person = await Person.findByIdAndDelete(personId);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.status(200).json(person);
  } catch (err) {
    console.error('Error deleting person', err);
    res.status(500).json({ error: 'Error deleting person' });
  }
});

export default router;