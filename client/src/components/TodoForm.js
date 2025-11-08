import React, { useState, useCallback, useEffect } from 'react';
import { validateField, debounce, sanitizeInput } from '../utils/validation';

/**
 * TodoForm Component
 * Form for creating and editing todos with real-time validation
 */
const TodoForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = initialData !== null;

  /**
   * Debounced validation for real-time feedback
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedValidation = useCallback(
    debounce((fieldName, value) => {
      if (touched[fieldName]) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    }, 300),
    [touched]
  );

  /**
   * Handle input change with real-time validation
   */
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    debouncedValidation('title', value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    debouncedValidation('description', value);
  };

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    
    // Validate immediately on blur
    const value = fieldName === 'title' ? title : description;
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  /**
   * Validate all fields
   */
  const validateAll = () => {
    const titleError = validateField('title', title);
    const descriptionError = validateField('description', description);

    const newErrors = {};
    if (titleError) newErrors.title = titleError;
    if (descriptionError) newErrors.description = descriptionError;

    setErrors(newErrors);
    setTouched({ title: true, description: true });

    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateAll()) {
      setIsSubmitting(true);
      try {
        await onSubmit({
          title: sanitizeInput(title),
          description: sanitizeInput(description),
        });

        // Reset form only if not in edit mode
        if (!isEditMode) {
          setTitle('');
          setDescription('');
          setErrors({});
          setTouched({});
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Add shake animation on validation error
      const form = e.target;
      form.classList.add('animate-shake');
      setTimeout(() => {
        form.classList.remove('animate-shake');
      }, 500);
    }
  };

  /**
   * Handle cancel button (edit mode only)
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form className="bg-white p-6 rounded-xl shadow-lg mb-8 animate-slideDown" onSubmit={handleSubmit}>
      <div className="mb-4 relative">
        <label htmlFor="todo-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="todo-title"
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => handleBlur('title')}
          className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
            errors.title && touched.title ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
          }`}
          maxLength={100}
          aria-invalid={errors.title && touched.title ? 'true' : 'false'}
          aria-describedby={errors.title && touched.title ? 'title-error' : undefined}
        />
        {errors.title && touched.title && (
          <span id="title-error" className="text-red-500 text-sm block mt-1 animate-fadeIn" role="alert">
            ⚠️ {errors.title}
          </span>
        )}
        <span className="absolute right-2 -bottom-6 text-xs text-gray-400">
          {title.length}/100
        </span>
      </div>

      <div className="mb-4 relative mt-6">
        <label htmlFor="todo-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="todo-description"
          placeholder="Add a description (optional)"
          value={description}
          onChange={handleDescriptionChange}
          onBlur={() => handleBlur('description')}
          className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all bg-gray-50 resize-vertical min-h-[80px] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
            errors.description && touched.description ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'
          }`}
          rows={3}
          maxLength={500}
          aria-invalid={errors.description && touched.description ? 'true' : 'false'}
          aria-describedby={errors.description && touched.description ? 'description-error' : undefined}
        />
        {errors.description && touched.description && (
          <span id="description-error" className="text-red-500 text-sm block mt-1 animate-fadeIn" role="alert">
            ⚠️ {errors.description}
          </span>
        )}
        <span className="absolute right-2 -bottom-6 text-xs text-gray-400">
          {description.length}/500
        </span>
      </div>

      <div className="flex gap-3 mt-6 flex-col md:flex-row">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              {isEditMode ? '💾 Save Changes' : '➕ Add TODO'}
            </>
          )}
        </button>
        {isEditMode && (
          <button 
            type="button" 
            className="md:flex-none px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold transition-all hover:bg-gray-200 flex items-center justify-center gap-2" 
            onClick={handleCancel}
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
