import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SignupState {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  proceed_token?: string;
  code?: string;
}

const initialState: SignupState = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  proceed_token: "",
  code: "",
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    saveSignupDetails: (state, action: PayloadAction<Partial<SignupState>>) => {
      return { ...state, ...action.payload };
    },
    clearSignupDetails: () => initialState,
  },
});

export const { saveSignupDetails, clearSignupDetails } = signupSlice.actions;
export default signupSlice.reducer;
