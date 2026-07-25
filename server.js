
import express from 'express';
import db from './db.js';
import Person from './Models/person.js';
import MenuItem from './Models/MenuItem.js';
import bodyParser from 'body-parser';
import personRoutes from './Routes/personRoutes.js';
import menuItemRoutes from './Routes/menuItemRoutes.js';

const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World!'); 
});

app.use('/person', personRoutes);
app.use('/menuitem', menuItemRoutes);
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});