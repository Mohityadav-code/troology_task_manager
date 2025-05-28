import { useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';

const Profile = () => {
  const user = useSelector(selectUser);
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 
                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Role</h3>
                  <p className="text-gray-900 capitalize">{user.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Joined</h3>
                  <p className="text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-6 pt-6">
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Account Type:</span> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Permissions:</span> {' '}
                {user.role === 'admin' 
                  ? 'Full access to manage users and tasks' 
                  : user.role === 'manager' 
                    ? 'Can create and assign tasks to employees' 
                    : 'Can view and update assigned tasks'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 