import React from 'react';
import TodoItem from './TodoItem';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * TodoList Component
 * Displays a list of todo items with skeleton loading
 */
const TodoList = ({ todos, onUpdate, onToggle, onDelete, loading }) => {
  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          📋 Loading...
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl shadow-lg">
        <div className="text-6xl mb-4 animate-float">📝</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No TODOs yet!</h3>
        <p className="text-gray-600">Start by adding your first task above.</p>
      </div>
    );
  }

  // Separate completed and pending todos
  const pendingTodos = todos.filter(todo => !todo.done);
  const completedTodos = todos.filter(todo => todo.done);

  return (
    <div>
      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            📋 Pending ({pendingTodos.length})
          </h2>
          {pendingTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={onUpdate}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            ✅ Completed ({completedTodos.length})
          </h2>
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onUpdate={onUpdate}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
