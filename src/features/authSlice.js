import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

 export const LoginUser = createAsyncThunk("user/LoginUser", async(user, thunkAPI) => {
    try {
        const response = await axios.post('https://api.rmchain.web.id/api/users/login', {
            email: user.email,
            password: user.password
        });
        console.log('success', response)
        return response.data.data;
    } catch (error) {
        console.log('error', error.response)
        if(error.response){
            const message = error.response.data.msg; //ambil dari backend
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const getMe = createAsyncThunk("user/getMe", async(_, thunkAPI) => {
    try {
        const response = await axios.get('https://api.rmchain.web.id/api/users/me');
        return response.data;
    } catch (error) {
        if(error.response){
            const message = error.response.data.msg; //ambil dari backend
            return thunkAPI.rejectWithValue(message);
        }
    }
});

export const LogOut = createAsyncThunk("user/LogOut", async() => {
    await axios.delete('https://api.rmchain.web.id/api/users/logout');
});

const initialState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle LoginUser
            .addCase(LoginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(LoginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(LoginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Handle getMe
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            });
    },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;