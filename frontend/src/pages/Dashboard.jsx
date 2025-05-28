import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTasks } from '../redux/slices/taskSlice';
import { selectTasksByStatus, selectTasks } from '../redux/slices/taskSlice';
import { selectIsAdmin, selectIsManager } from '../redux/slices/authSlice';
import { FaCheckCircle, FaClipboardList, FaHourglassHalf, FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector(selectTasks);
  const isAdmin = useSelector(selectIsAdmin);
  const isManager = useSelector(selectIsManager);
  
  // Get tasks by status
  const pendingTasks = useSelector((state) => selectTasksByStatus(state, 'pending'));
  const inProgressTasks = useSelector((state) => selectTasksByStatus(state, 'in-progress'));
  const completedTasks = useSelector((state) => selectTasksByStatus(state, 'completed'));

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Get recent 5 tasks sorted by createdAt
  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        {(isAdmin || isManager) && (
          <Link 
            to="/tasks/new" 
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            Create Task
          </Link>
        )}
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Tasks</p>
              <h3 className="text-2xl font-bold text-gray-800">{allTasks.length}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaClipboardList className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <h3 className="text-2xl font-bold text-gray-800">{pendingTasks.length}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FaHourglassHalf className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-800">{inProgressTasks.length}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <FaSpinner className="h-6 w-6 text-indigo-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Completed</p>
              <h3 className="text-2xl font-bold text-gray-800">{completedTasks.length}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Tasks</h2>
        
        {recentTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found. Create your first task to get started.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/tasks/${task._id}`} className="text-blue-500 hover:text-blue-700 font-medium">
                          {task.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            task.status === 'in-progress' ? 'bg-indigo-100 text-indigo-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {task.status === 'in-progress' ? 'In Progress' : 
                            task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-orange-100 text-orange-800' : 
                            'bg-blue-100 text-blue-800'}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {allTasks.length > 5 && (
              <div className="mt-4 text-right">
                <Link to="/tasks" className="text-blue-500 hover:text-blue-700">
                  Show all tasks →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;