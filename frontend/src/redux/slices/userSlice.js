import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userService.createUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// Users slice
const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectCurrentUser = (state) => state.users.currentUser;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

export default userSlice.reducer; 