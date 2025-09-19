require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const app = express();  // initialize express
app.use(cors());
app.use(express.json());  // to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5001;

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

// Get products by category
app.get('/products/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: { $regex: category, $options: 'i' } });
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products by category: ' + error.message);
  }
});

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).send('Error fetching categories: ' + error.message);
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

// External API integrations

// Fake Store API integration
app.get('/external/fakestore/products', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching from Fake Store API: ' + error.message);
  }
});

app.get('/external/fakestore/products/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching product from Fake Store API: ' + error.message);
  }
});

app.get('/external/fakestore/categories', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching categories from Fake Store API: ' + error.message);
  }
});

app.get('/external/fakestore/category/:category', async (req, res) => {
  try {
    const response = await axios.get(`https://fakestoreapi.com/products/category/${req.params.category}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching category from Fake Store API: ' + error.message);
  }
});

// JSONPlaceholder API (for demo purposes)
app.get('/external/jsonplaceholder/posts', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching from JSONPlaceholder: ' + error.message);
  }
});

// Unsplash API for images (requires API key)
app.get('/external/unsplash/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const response = await axios.get(`https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=YOUR_UNSPLASH_ACCESS_KEY`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching from Unsplash API: ' + error.message);
  }
});

// Weather API example
app.get('/external/weather/:city', async (req, res) => {
  try {
    const city = req.params.city;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_OPENWEATHER_API_KEY&units=metric`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching weather data: ' + error.message);
  }
});

// Currency exchange API
app.get('/external/currency/:from/:to/:amount', async (req, res) => {
  try {
    const { from, to, amount } = req.params;
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const rate = response.data.rates[to];
    const convertedAmount = amount * rate;
    res.json({
      from,
      to,
      amount: parseFloat(amount),
      rate,
      convertedAmount
    });
  } catch (error) {
    res.status(500).send('Error fetching currency data: ' + error.message);
  }
});

// News API
app.get('/external/news/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?category=${category}&apiKey=YOUR_NEWS_API_KEY`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching news: ' + error.message);
  }
});

// GitHub API for repositories
app.get('/external/github/repos/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const response = await axios.get(`https://api.github.com/users/${username}/repos`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching GitHub repos: ' + error.message);
  }
});

// Additional No-Key APIs

// Random User API
app.get('/external/randomuser/:count', async (req, res) => {
  try {
    const count = req.params.count || 1;
    const response = await axios.get(`https://randomuser.me/api/?results=${count}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching random users: ' + error.message);
  }
});

// Quotes API
app.get('/external/quotes/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching quote: ' + error.message);
  }
});

// Jokes API
app.get('/external/jokes/random', async (req, res) => {
  try {
    const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching joke: ' + error.message);
  }
});

// Cat Facts API
app.get('/external/catfacts/random', async (req, res) => {
  try {
    const response = await axios.get('https://catfact.ninja/fact');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching cat fact: ' + error.message);
  }
});

// Dog API
app.get('/external/dog/random', async (req, res) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching dog image: ' + error.message);
  }
});

// Bored API (activity suggestions)
app.get('/external/bored/activity', async (req, res) => {
  try {
    const response = await axios.get('https://www.boredapi.com/api/activity');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching activity: ' + error.message);
  }
});

// Advice API
app.get('/external/advice/random', async (req, res) => {
  try {
    const response = await axios.get('https://api.adviceslip.com/advice');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching advice: ' + error.message);
  }
});

// Country API
app.get('/external/countries/all', async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching countries: ' + error.message);
  }
});

app.get('/external/countries/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching country: ' + error.message);
  }
});

// University API
app.get('/external/universities/:country', async (req, res) => {
  try {
    const country = req.params.country;
    const response = await axios.get(`http://universities.hipolabs.com/search?country=${country}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching universities: ' + error.message);
  }
});

// IP Geolocation API
app.get('/external/ipinfo', async (req, res) => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching IP info: ' + error.message);
  }
});

// Order routes
app.post('/orders', async (req, res) => {
  try {
    // Generate unique order ID
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const orderData = {
      ...req.body,
      orderId,
      status: 'pending'
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: savedOrder.orderId,
      order: savedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Error creating order: ' + error.message);
  }
});

app.get('/orders/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders: ' + error.message);
  }
});

app.get('/orders/single/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (order) {
      res.json(order);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching order: ' + error.message);
  }
});

// Admin routes
app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).send('Error fetching orders: ' + error.message);
  }
});

app.put('/admin/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (order) {
      res.json(order);
    } else {
      res.status(404).send('Order not found');
    }
  } catch (error) {
    res.status(500).send('Error updating order status: ' + error.message);
  }
});



app.get('/', (req, res) => {
  res.send('Hello World from Express');
});

// Seed admin user and products if none exist
const seedData = async () => {
  try {
    // Seed admin user
    const adminCount = await User.countDocuments({ email: 'yogesh@1234gmail.com' });
    if (adminCount === 0) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'yogesh@1234gmail.com',
        password: 'yogesh1234',
        phone: '+1 (987) 654-3210',
        address: 'Krishna Nagar, Mathura, Uttar Pradesh, India',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    }

    // Seed products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          name: 'Gaming Laptop',
          description: 'High-performance gaming laptop with RTX graphics',
          price: 1299,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
          stock: 10
        },
        {
          name: 'Smartphone Pro',
          description: 'Latest smartphone with advanced camera system',
          price: 899,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500',
          stock: 20
        },
        {
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling wireless headphones',
          price: 299,
          category: 'Electronics',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          stock: 15
        },
        {
          name: 'Designer Watch',
          description: 'Elegant designer watch with leather strap',
          price: 450,
          category: 'Fashion',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          stock: 8
        },
        {
          name: 'Coffee Maker',
          description: 'Automatic coffee maker with programmable settings',
          price: 120,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
          stock: 12
        },
        {
          name: 'Yoga Mat',
          description: 'Non-slip yoga mat for all fitness levels',
          price: 35,
          category: 'Sports & Fitness',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
          stock: 25
        },
        {
          name: 'Novel - The Great Adventure',
          description: 'Bestselling adventure novel by renowned author',
          price: 18,
          category: 'Books',
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
          stock: 30
        },
        {
          name: 'LED Desk Lamp',
          description: 'Adjustable LED desk lamp with USB charging',
          price: 45,
          category: 'Home & Kitchen',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          stock: 18
        }
      ];
      await Product.insertMany(products);
      console.log('Sample products with images added');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await seedData();
});
