require('dotenv').config();
const mongoose = require('mongoose');
const Todo = require('./models/Todo');

/**
 * Seed database with sample TODO data
 * Run with: node seed.js
 */

const sampleTodos = [
  {
    title: 'Welcome to TODO App! 🎉',
    description: 'This is a sample todo to get you started. Try editing or marking it as done!',
    done: false,
  },
  {
    title: 'Learn React Hooks',
    description: 'Study useState, useEffect, and custom hooks',
    done: false,
  },
  {
    title: 'Build a REST API',
    description: 'Create a RESTful API with Express.js and MongoDB',
    done: true,
  },
  {
    title: 'Master MongoDB',
    description: 'Learn about schemas, queries, and aggregation pipelines',
    done: false,
  },
  {
    title: 'Implement Authentication',
    description: 'Add JWT-based authentication to the application',
    done: false,
  },
  {
    title: 'Deploy to Production',
    description: 'Deploy backend to Heroku and frontend to Netlify',
    done: true,
  },
  {
    title: 'Write Documentation',
    description: 'Create comprehensive README files and API documentation',
    done: true,
  },
  {
    title: 'Add Dark Mode',
    description: 'Implement a dark mode toggle for better user experience',
    done: false,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing todos
    console.log('🗑️  Clearing existing todos...');
    await Todo.deleteMany({});
    console.log('✅ Cleared existing todos');

    // Insert sample todos
    console.log('📝 Inserting sample todos...');
    const todos = await Todo.insertMany(sampleTodos);
    console.log(`✅ Inserted ${todos.length} sample todos`);

    // Display created todos
    console.log('\n📋 Created TODOs:');
    todos.forEach((todo, index) => {
      const status = todo.done ? '✅' : '⬜';
      console.log(`  ${index + 1}. ${status} ${todo.title}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('💡 Start your app and see the sample todos\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
