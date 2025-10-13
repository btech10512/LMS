import { createSlice } from "@reduxjs/toolkit";
const initialSlice = {
      user:null,
      isAuthenticated:false,
}

const authSlice =  createSlice({
      name:"authSlice",
      initialState:initialSlice,
      reducers:{
            userLoggedIn:(state,action) => {
                  state.user = action.payload.user
                  state.isAuthenticated = true
            },
            userLoggedOut:(state) => {
                  state.user = null
                  state.isAuthenticated = false
            }
      }
})

export const {userLoggedIn,userLoggedOut} = authSlice.actions
export default authSlice.reducer