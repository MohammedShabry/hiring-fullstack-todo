import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { ToastContainer } from './components/Toast';
import todoService from './services/api';
import { formatApiError } from './utils/validation';

/**
 * Main App Component
 * Manages the TODO application state and coordinates all components
 */
function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  /**
   * Fetch all todos on component mount
   */
  useEffect(() => {
    fetchTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Add a toast notification
   */
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  /**
   * Remove a toast notification
   */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  /**
   * Fetch todos from API
   */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      addToast(errorMessage, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new todo
   */
  const handleCreateTodo = async (todoData) => {
    // Optimistic update
    const tempTodo = {
      _id: 'temp-' + Date.now(),
      ...todoData,
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true, // Flag for optimistic update
    };
    setTodos([tempTodo, ...todos]);

    try {
      // API call
      const newTodo = await todoService.createTodo(todoData);
      
      // Replace temp todo with real one
      setTodos((prev) => prev.map((t) => (t._id === tempTodo._id ? newTodo : t)));
      
      addToast('TODO created successfully!', 'success');
    } catch (err) {
      console.error('Error creating todo:', err);
      // Remove temp todo on error
      setTodos((prev) => prev.filter((t) => t._id !== tempTodo._id));
      const errorMessage = formatApiError(err);
      addToast(errorMessage, 'error', 5000);
    }
  };

  /**
   * Update a todo
   */
  const handleUpdateTodo = async (id, updatedData) => {
    // Store original for rollback
    const originalTodo = todos.find((todo) => todo._id === id);

    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, ...updatedData, isOptimistic: true } : todo
        )
      );

      // API call
      const updatedTodo = await todoService.updateTodo(id, updatedData);
      
      // Update with server response
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      
      addToast('TODO updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating todo:', err);
      // Rollback on error
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? originalTodo : todo))
      );
      const errorMessage = formatApiError(err);
      addToast(errorMessage, 'error', 5000);
    }
  };

  /**
   * Toggle todo done status
   */
  const handleToggleTodo = async (id) => {
    // Store original for rollback
    const originalTodo = todos.find((todo) => todo._id === id);

    try {
      // Optimistic update
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, done: !todo.done, isOptimistic: true } : todo
        )
      );

      // API call
      const updatedTodo = await todoService.toggleTodoDone(id);
      
      // Update with server response
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updatedTodo : todo))
      );
      
      addToast(
        updatedTodo.done ? 'TODO marked as done! 🎉' : 'TODO marked as pending',
        'success'
      );
    } catch (err) {
      console.error('Error toggling todo:', err);
      // Rollback on error
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? originalTodo : todo))
      );
      const errorMessage = formatApiError(err);
      addToast(errorMessage, 'error', 5000);
    }
  };

  /**
   * Delete a todo
   */
  const handleDeleteTodo = async (id) => {
    // Store original for rollback
    const originalTodos = [...todos];

    try {
      // Optimistic update
      setTodos((prev) => prev.filter((todo) => todo._id !== id));

      // API call
      await todoService.deleteTodo(id);
      
      addToast('TODO deleted successfully!', 'success');
    } catch (err) {
      console.error('Error deleting todo:', err);
      // Rollback on error
      setTodos(originalTodos);
      const errorMessage = formatApiError(err);
      addToast(errorMessage, 'error', 5000);
    }
  };

  /**
   * Show notification (legacy support, now uses addToast)
   */
  const showNotification = (message, type = 'info') => {
    addToast(message, type);
  };

  // Calculate stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.done).length;
  const pendingTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md shadow-lg animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-white text-4xl md:text-5xl font-extrabold text-center mb-2 flex items-center justify-center gap-4 drop-shadow-lg">
            MyTasks
          </h1>
          <p className="text-white/90 text-lg md:text-xl text-center font-light">
            Organize your tasks efficiently
          </p>
        </div>
      </header>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg text-center border border-white/30">
            <div className="text-5xl mb-2">📋</div>
            <div className="text-3xl font-bold text-white">{totalTodos}</div>
            <div className="text-white/80 text-sm font-medium">Total Tasks</div>
          </div>
          
          {/* Completed */}
          <div className="bg-green-500/30 backdrop-blur-md rounded-xl p-6 shadow-lg text-center border border-green-400/50">
            <div className="text-5xl mb-2">✅</div>
            <div className="text-3xl font-bold text-white">{completedTodos}</div>
            <div className="text-white/80 text-sm font-medium">Completed</div>
          </div>
          
          {/* Pending */}
          <div className="bg-yellow-500/30 backdrop-blur-md rounded-xl p-6 shadow-lg text-center border border-yellow-400/50">
            <div className="text-5xl mb-2">⏳</div>
            <div className="text-3xl font-bold text-white">{pendingTodos}</div>
            <div className="text-white/80 text-sm font-medium">Pending</div>
          </div>
          
          {/* Completion Rate */}
          <div className="bg-blue-500/30 backdrop-blur-md rounded-xl p-6 shadow-lg text-center border border-blue-400/50">
            <div className="text-5xl mb-2">📊</div>
            <div className="text-3xl font-bold text-white">{completionRate}%</div>
            <div className="text-white/80 text-sm font-medium">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-900 px-6 py-4 rounded-xl mb-8 flex items-start justify-between shadow-lg animate-fadeIn">
              <div>
                <h3 className="font-bold mb-1">Connection Error</h3>
                <p className="text-sm">{error}</p>
              </div>
              <button 
                onClick={() => {
                  setError(null);
                  fetchTodos();
                }} 
                className="px-4 py-2 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-800 transition-all hover:scale-105 flex items-center gap-2"
              >
                🔄 Retry
              </button>
            </div>
          )}

          {/* Notification Toast */}
          {/* Removed - now using ToastContainer */}

          {/* Two Column Layout: Form on Left, Todos on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Add TODO Form */}
            <div className="lg:col-span-1">
              <TodoForm onSubmit={handleCreateTodo} />
            </div>

            {/* Right Column - TODO List */}
            <div className="lg:col-span-2">
              <TodoList
                todos={todos}
                onUpdate={handleUpdateTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}

export default App;
