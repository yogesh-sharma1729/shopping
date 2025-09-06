require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();  // initialize express
app.use(cors());
app.use(express.json());  // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const PORT = 5001;

// Connect to database
connectDB();

// Route to add a user
app.post('/add-user', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { name, email, password, phone, address } = req.body;
    const lowerEmail = email.toLowerCase();
    const user = new User({ name, email: lowerEmail, password, phone, address });
    const savedUser = await user.save();
    console.log('User saved:', savedUser);
    res.status(201).json({ message: 'User added successfully', user: { name, email: lowerEmail } });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route to login a user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();
    console.log('Login attempt:', lowerEmail, password);
    const user = await User.findOne({ email: lowerEmail, password });
    console.log('User found:', user);
    if (user) {
      res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    res.status(500).send('Error logging in: ' + error.message);
  }
});

// Route to get user profile
app.get('/user/:email', async (req, res) => {
  try {
    const lowerEmail = req.params.email.toLowerCase();
    console.log('Profile request for email:', lowerEmail);
    const user = await User.findOne({ email: lowerEmail });
    console.log('User found for profile:', user);
    if (user) {
      res.json({ name: user.name, email: user.email, phone: user.phone, address: user.address });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching user: ' + error.message);
  }
});

// Route to update user profile
app.put('/user/:email', async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const lowerEmail = req.params.email.toLowerCase();
    const user = await User.findOneAndUpdate(
      { email: lowerEmail },
      { name, phone, address },
      { new: true }
    );
    if (user) {
      res.json({ name: user.name, email: user.email, phone: user.phone, address: user.address });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send('Error updating user: ' + error.message);
  }
});

// Product routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products: ' + error.message);
  }
});

app.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send('Error adding product: ' + error.message);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Product not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching product: ' + error.message);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World from Express');
});

// Seed products if none exist
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        { name: 'Laptop', description: 'A powerful laptop', price: 1000, category: 'Electronics', stock: 10 },
        { name: 'Phone', description: 'Smartphone', price: 500, category: 'Electronics', stock: 20 },
        { name: 'Book', description: 'Interesting book', price: 20, category: 'Books', stock: 50 }
      ];
      await Product.insertMany(products);
      console.log('Sample products added');
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

// start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await seedProducts();
});
