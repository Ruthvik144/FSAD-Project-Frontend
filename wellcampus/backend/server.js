const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data.json');

const readDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (error) {
    console.error('Failed to read database:', error);
    return {};
  }
};

const writeDb = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

const getCollection = (db, collection) => {
  if (!db || typeof db !== 'object') return null;
  return db[collection];
};

app.get('/api', (req, res) => {
  const db = readDb();
  res.json({ collections: Object.keys(db) });
});

app.get('/api/data', (req, res) => {
  res.json(readDb());
});

app.post('/api/auth/register', (req, res) => {
  const db = readDb();
  if (!db.users) db.users = [];
  
  const { name, email, password, role, age, phone } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const existingUser = db.users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with that email' });
  }
  
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, 
    role: role || 'student',
    age,
    phone,
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  writeDb(db);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ success: true, user: userWithoutPassword });
});

app.post('/api/auth/login', (req, res) => {
  const db = readDb();
  if (!db.users) db.users = [];
  
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, user: userWithoutPassword });
});

app.get('/api/:collection', (req, res) => {
  const { collection } = req.params;
  const db = readDb();
  const items = getCollection(db, collection);
  if (!items) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  res.json(items);
});

app.get('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const db = readDb();
  const items = getCollection(db, collection);
  if (!items) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  const idNum = parseInt(id, 10);
  const item = items.find((entry) => entry.id === idNum);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

app.post('/api/:collection', (req, res) => {
  const { collection } = req.params;
  const db = readDb();
  const items = getCollection(db, collection);
  if (!items) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  const newItem = req.body;
  if (!newItem || typeof newItem !== 'object') {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  newItem.id = Number.isInteger(newItem.id) ? newItem.id : Date.now();
  db[collection] = [newItem, ...items];
  writeDb(db);
  res.status(201).json(newItem);
});

app.put('/api/:collection', (req, res) => {
  const { collection } = req.params;
  const db = readDb();
  if (!db[collection]) {
    return res.status(404).json({ error: 'Collection not found' });
  }
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Expected an array payload' });
  }

  db[collection] = req.body;
  writeDb(db);
  res.json(db[collection]);
});

app.put('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const db = readDb();
  const items = getCollection(db, collection);
  if (!items) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  const idNum = parseInt(id, 10);
  const index = items.findIndex((entry) => entry.id === idNum);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const updatedItem = { ...items[index], ...req.body, id: idNum };
  items[index] = updatedItem;
  writeDb(db);
  res.json(updatedItem);
});

app.delete('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const db = readDb();
  const items = getCollection(db, collection);
  if (!items) {
    return res.status(404).json({ error: 'Collection not found' });
  }

  const idNum = parseInt(id, 10);
  const filtered = items.filter((entry) => entry.id !== idNum);
  if (filtered.length === items.length) {
    return res.status(404).json({ error: 'Item not found' });
  }

  db[collection] = filtered;
  writeDb(db);
  res.json({ success: true, remaining: db[collection] });
});

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
