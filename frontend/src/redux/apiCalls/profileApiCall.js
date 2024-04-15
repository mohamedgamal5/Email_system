import request from "../../utils/request";
import { toast } from "react-toastify";
import { profileActions } from "../slices/profileSlice";
import { authActions } from "../slices/authSlice";
//get user profile
export function getUserProfile(userId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/users/profile/${userId}`);
      dispatch(profileActions.setProfile(data?.user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//upload profile photo
export function uploadProfilePhoto(photo) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const state = getState();
      await request
        .post(`/api/users/profile/profile-photo-upload`, photo, {
          headers: {
            Authorization: state.auth.user.token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          dispatch(profileActions.setProfilePhoto(data.profilePhoto));
          dispatch(authActions.setUserPhoto(data.profilePhoto));

          dispatch(profileActions.setProfileUpdated());
          toast.success(data?.message);
          dispatch(profileActions.clearProfileUpdated()); // modify the user in local storage with new photo
          const user = JSON.parse(localStorage.getItem("userInfo"));
          user.profilePhoto = data?.profilePhoto;
          localStorage.setItem("userInfo", JSON.stringify(user));
        });
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(profileActions.clearLoading());
    }
  };
}

//update profile
export function updateProfile(userId, profile) {
  return async (dispatch, getState) => {
    try {
      const state = getState();
      const { data } = await request.put(
        `/api/users/profile/${userId}`,
        profile,
        {
          headers: {
            Authorization: state.auth.user.token,
          },
        }
      );
      // console.log("zzzzzzzzz", profile);
      // console.log("yyyyyyyy", data);

      dispatch(profileActions.updateProfile(data?.updateUser));
      dispatch(authActions.setUsername(data?.updateUser?.username));
      // modify the user in local storage with new username
      const user = JSON.parse(localStorage.getItem("userInfo"));

      user.username = data?.updateUser?.username;
      // console.log("xxxxxxxx", user);
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//delete profile
export function deleteeProfile(userId) {
  return async (dispatch, getState) => {
    try {
      dispatch(profileActions.setLoading());
      const { data } = await request.delete(`/api/users/profile/${userId}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(profileActions.setProfileDeleted());
      toast.success(data?.message);
      setTimeout(() => dispatch(profileActions.clearProfileDeleted()), 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(profileActions.clearLoading());
    }
  };
}
