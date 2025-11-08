const Todo = require('../models/Todo');

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      message: 'Error fetching todos', 
      error: error.message 
    });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      done: false,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Error creating todo', 
      error: error.message 
    });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    todo.title = title.trim();
    todo.description = description ? description.trim() : '';

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors 
      });
    }
    
    res.status(500).json({ 
      message: 'Error updating todo', 
      error: error.message 
    });
  }
};

exports.toggleTodoDone = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    todo.done = !todo.done;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo status:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error toggling todo status', 
      error: error.message 
    });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }

    await todo.deleteOne();
    res.json({ 
      message: 'Todo deleted successfully',
      id: req.params.id 
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ 
        message: 'Todo not found' 
      });
    }
    
    res.status(500).json({ 
      message: 'Error deleting todo', 
      error: error.message 
    });
  }
};
