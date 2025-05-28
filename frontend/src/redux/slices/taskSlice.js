import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { taskService } from '../../services/api';

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await taskService.getAllTasks(filters);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await taskService.getTaskById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch task');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await taskService.createTask(taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    currentTask: null,
    loading: false,
    error: null,
    stats: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0
    }
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        
        // Calculate stats
        state.stats.total = action.payload.length;
        state.stats.pending = action.payload.filter(task => task.status === 'pending').length;
        state.stats.inProgress = action.payload.filter(task => task.status === 'in-progress').length;
        state.stats.completed = action.payload.filter(task => task.status === 'completed').length;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.stats.total += 1;
        state.stats.pending += action.payload.status === 'pending' ? 1 : 0;
        state.stats.inProgress += action.payload.status === 'in-progress' ? 1 : 0;
        state.stats.completed += action.payload.status === 'completed' ? 1 : 0;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        
        // First, find the old task to update stats
        const oldTask = state.tasks.find(task => task._id === action.payload._id);
        
        // Update stats based on status changes
        if (oldTask && oldTask.status !== action.payload.status) {
          // Decrement old status count
          if (oldTask.status === 'pending') state.stats.pending -= 1;
          else if (oldTask.status === 'in-progress') state.stats.inProgress -= 1;
          else if (oldTask.status === 'completed') state.stats.completed -= 1;
          
          // Increment new status count
          if (action.payload.status === 'pending') state.stats.pending += 1;
          else if (action.payload.status === 'in-progress') state.stats.inProgress += 1;
          else if (action.payload.status === 'completed') state.stats.completed += 1;
        }
        
        // Update tasks array
        state.tasks = state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        );
        
        // If this is the current task being viewed, update it
        if (state.currentTask && state.currentTask._id === action.payload._id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        
        // Find the task to remove for updating stats
        const taskToRemove = state.tasks.find(task => task._id === action.payload);
        
        // Update stats
        if (taskToRemove) {
          state.stats.total -= 1;
          if (taskToRemove.status === 'pending') state.stats.pending -= 1;
          else if (taskToRemove.status === 'in-progress') state.stats.inProgress -= 1;
          else if (taskToRemove.status === 'completed') state.stats.completed -= 1;
        }
        
        // Remove task from array
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        
        // Clear current task if it was deleted
        if (state.currentTask && state.currentTask._id === action.payload) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTaskError, clearCurrentTask } = taskSlice.actions;

export const selectTasks = (state) => state.tasks.tasks;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTaskStats = (state) => state.tasks.stats;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

export const selectTasksByStatus = (state, status) => {
  return state.tasks.tasks.filter(task => task.status === status);
};

export default taskSlice.reducer; 