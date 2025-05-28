import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, selectUsers, selectUsersLoading, selectUsersError } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(createUser(formData)).unwrap();
      toast.success('User created successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
      });
      setShowForm(false);
    } catch (error) {
      toast.error(error || 'Failed to create user');
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'Add New User'}
        </button>
      </div>
      
      {/* User Creation Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter user name"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter user email"
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter user password"
                />
                {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full border ${formErrors.role ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {formErrors.role && <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* User List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList; 