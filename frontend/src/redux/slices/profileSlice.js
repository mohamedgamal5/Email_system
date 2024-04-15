import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    isProfileDeleted: false,
    isProfileUpdated: false,
    usersCount: null,
    profiles: [],
  },
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
    },
    setProfilePhoto(state, action) {
      state.profile.profilePhoto = action.payload;
    },
    updateProfile(state, action) {
      state.profile = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setProfileDeleted(state) {
      state.isProfileDeleted = true;
      state.loading = false;
    },
    clearProfileDeleted(state) {
      state.isProfileDeleted = false;
    },
    setUserCount(state, action) {
      state.usersCount = action.payload;
    },
    setProfiles(state, action) {
      state.profiles = action.payload;
    },
    setProfileUpdated(state) {
      state.isProfileUpdated = true;
      state.loading = false;
    },
    clearProfileUpdated(state) {
      state.isProfileUpdated = false;
    },
  },
});

const profileReducer = profileSlice.reducer;
const profileActions = profileSlice.actions;

export { profileReducer, profileActions };
