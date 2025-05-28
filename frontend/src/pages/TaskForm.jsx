import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, updateTask, fetchTaskById, selectCurrentTask, selectTasksLoading } from '../redux/slices/taskSlice';
import { fetchUsers, selectUsers } from '../redux/slices/userSlice';
import { selectUser, selectIsAdmin, selectIsManager } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';

const TaskForm = ({ viewOnly = false }) => {
  const { id } = useParams();
  const isEditMode = !!id && !viewOnly;
  const isViewMode = !!id && viewOnly;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const currentTask = useSelector(selectCurrentTask);
  const loading = useSelector(selectTasksLoading);
  const users = useSelector(selectUsers);
  const currentUser = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Fetch task data if in edit or view mode
  useEffect(() => {
    if (id) {
      dispatch(fetchTaskById(id));
    }
  }, [dispatch, id]);
  
  // Fetch users for assignee dropdown
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  // Populate form when editing or viewing
  useEffect(() => {
    if (id && currentTask) {
      const dueDate = new Date(currentTask.dueDate).toISOString().split('T')[0];
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        status: currentTask.status || 'pending',
        priority: currentTask.priority || 'medium',
        dueDate,
        assignedTo: currentTask.assignedTo?._id || currentTask.assignedTo || ''
      });
    }
  }, [currentTask, id]);
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assignee is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    if (viewOnly) return; // No changes in view mode
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (viewOnly) {
      navigate('/tasks');
      return;
    }
    
    if (!validateForm()) return;
    
    try {
      if (isEditMode) {
        await dispatch(updateTask({ id, taskData: formData })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask({ ...formData, creator: currentUser._id })).unwrap();
        toast.success('Task created successfully');
      }
      navigate('/tasks');
    } catch (error) {
      toast.error(error || `Failed to ${isEditMode ? 'update' : 'create'} task`);
    }
  };
  
  // Show edit button if in view mode and user has permission
  const canEdit = currentTask && (
    isAdmin || 
    isManager || 
    currentUser?._id === currentTask.creator?._id || 
    currentUser?._id === currentTask.assignedTo?._id
  );
  
  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isViewMode ? 'Task Details' : isEditMode ? 'Edit Task' : 'Create Task'}
        </h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={viewOnly}
                className={`w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
              />
              {errors.title && !viewOnly && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={viewOnly}
                rows="4"
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
              ></textarea>
              {errors.description && !viewOnly && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={viewOnly}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={viewOnly}
                  className={`w-full border border-gray-300 rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  disabled={viewOnly}
                  className={`w-full border ${errors.dueDate ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
                />
                {errors.dueDate && !viewOnly && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  disabled={viewOnly}
                  className={`w-full border ${errors.assignedTo ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 ${viewOnly ? 'bg-gray-50 cursor-not-allowed' : 'focus:outline-none focus:ring-blue-500 focus:border-blue-500'}`}
                >
                  <option value="">Select Assignee</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
                {errors.assignedTo && !viewOnly && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
              </div>
            </div>
            
            {currentTask && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                  <div className="text-gray-600 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {currentTask.creator?.name || 'Unknown'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                  <div className="text-gray-600 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                    {new Date(currentTask.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Back to Tasks
              </button>
              
              {viewOnly && canEdit ? (
                <button
                  type="button"
                  onClick={() => navigate(`/tasks/${id}/edit`)}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Edit Task
                </button>
              ) : !viewOnly && (
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  {isEditMode ? 'Update Task' : 'Create Task'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 