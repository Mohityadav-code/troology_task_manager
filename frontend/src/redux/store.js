import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import userReducer from './slices/userSlice';

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'] 
};


const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    tasks: taskReducer,
    users: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});


const persistor = persistStore(store);

export { store, persistor }; 