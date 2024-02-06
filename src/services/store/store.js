import { configureStore } from '@reduxjs/toolkit/react'
import {authApi} from "../api/authApi.js";
import authSlice from "../auth/authSlice.js";
import {userApi} from "../api/userApi.js";
import {propertyApi} from "../api/propertyApi.js";
import userSlice from "./userSlice.js";
import {unitApi} from "../api/unitApi.js";
import {tenantApi} from "../api/tenantApi.js";
import {leaseApi} from "../api/leaseApi.js";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        authSlice: authSlice,
        userSlice: userSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([authApi.middleware])

})


