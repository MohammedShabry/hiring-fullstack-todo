import React, { useState } from 'react';
import TodoForm from './TodoForm';

/**
 * TodoItem Component
 * Displays a single todo item with edit, toggle, and delete functionality
 */
const TodoItem = ({ todo, onUpdate, onToggle, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Handle edit mode
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Handle save after editing
   */
  const handleSave = async (updatedData) => {
    await onUpdate(todo._id, updatedData);
    setIsEditing(false);
  };

  /**
   * Handle cancel editing
   */
  const handleCancel = () => {
    setIsEditing(false);
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this TODO?')) {
      onDelete(todo._id);
    }
  };

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render edit mode
  if (isEditing) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-xl mb-4">
        <TodoForm
          initialData={todo}
          onSubmit={handleSave}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  // Render normal mode
  return (
    <div className={`relative bg-white p-5 rounded-xl shadow-md mb-4 flex gap-4 items-start transition-all hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5 border-2 animate-fadeIn ${
      todo.done ? 'bg-gray-50 opacity-80' : ''
    } ${todo.isOptimistic ? 'border-blue-300 opacity-70' : 'border-transparent'}`}>
      {todo.isOptimistic && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex-shrink-0 mt-1">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo._id)}
          id={`todo-${todo._id}`}
          className="sr-only peer"
        />
        <label 
          htmlFor={`todo-${todo._id}`} 
          className="w-6 h-6 border-2 border-gray-300 rounded-md inline-block relative cursor-pointer transition-all hover:scale-110 peer-checked:bg-gradient-to-br peer-checked:from-indigo-500 peer-checked:to-purple-600 peer-checked:border-indigo-500"
        >
          {todo.done && (
            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
              ✓
            </span>
          )}
        </label>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`text-lg font-semibold text-gray-900 mb-2 break-words transition-all ${
          todo.done ? 'line-through text-gray-400' : ''
        }`}>
          {todo.title}
        </h3>
        {todo.description && (
          <p className={`text-gray-600 text-sm mb-3 break-words leading-relaxed ${
            todo.done ? 'text-gray-400' : ''
          }`}>
            {todo.description}
          </p>
        )}
        <div className="flex gap-3 flex-wrap items-center">
          <span className="text-xs text-gray-400">
            📅 {formatDate(todo.createdAt)}
          </span>
          {todo.done && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-xl font-semibold">
              ✅ Completed
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          onClick={handleEdit}
          title="Edit"
          disabled={todo.done}
        >
          ✏️
        </button>
        <button
          className="w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 transition-all hover:scale-110 active:scale-95 flex items-center justify-center text-lg text-white shadow-md"
          onClick={handleDelete}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
