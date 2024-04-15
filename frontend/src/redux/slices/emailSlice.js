import { createSlice } from "@reduxjs/toolkit";

const emailSlice = createSlice({
  name: "email",
  initialState: {
    emails: [],
    email: null,
    createdEmail: null,
    file: null,
    loading: false,
    isEmailSent: false,
  },
  reducers: {
    setEmails(state, action) {
      state.emails = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setCreateEmail(state, action) {
      state.emails = action.payload;
    },
    download(state, action) {
      state.file = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setIsEmailCreated(state) {
      state.isEmailCreated = true;
      state.loading = false;
    },
    clearIsEmailCreated(state) {
      state.isEmailCreated = false;
    },
    setIsEmailSent(state) {
      state.isEmailCreated = true;
      state.loading = false;
    },
    clearIsEmailSent(state) {
      state.isEmailCreated = false;
    },
    deleteEmail(state, action) {
      state.emails = state.emails.filter((p) => p._id !== action.payload);
    },
  },
});

const emailReducer = emailSlice.reducer;
const emailActions = emailSlice.actions;

export { emailReducer, emailActions };
