import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";
import UpdateProfile from "./UpdateProfile";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteeProfile,
  getUserProfile,
  uploadProfilePhoto,
} from "../../redux/apiCalls/profileApiCall";
import { useParams, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { logoutUser } from "../../redux/apiCalls/authApiCall";
const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [updateProfile, setUpdateProfile] = useState(false);
  const { profile, loading, isProfileDeleted } = useSelector(
    (state) => state.profile
  );
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getUserProfile(id));
    window.scrollTo(0, 0);
  }, [id]);

  const navigate = useNavigate();
  useEffect(() => {
    if (isProfileDeleted) {
      navigate("/login");
    }
  }, [navigate, isProfileDeleted]);

  // useEffect(() => {
  //   if (isProfileDeleted) {
  //     navigate("/login");
  //   }
  // }, [navigate, isProfileDeleted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return toast.warning("there is no file!");
    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadProfilePhoto(formData));
  };

  const deleteAccountHandler = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover profile!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteeProfile(user?._id));
        dispatch(logoutUser());
      }
    });
  };
  if (loading) {
    return (
      <div className="profile-loader">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#00f"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          wrapperClass=""
          secondaryColor="grey"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }
  return (
    <section className="profile">
      <div className="profile-header">
        <div className="profile-image-wrapper">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : profile?.profilePhoto?.publicId
                ? profile?.profilePhoto?.url
                : "/images/image.png"
            }
            alt="user photo"
            className="profile-image"
          />
          {user?._id === profile?._id && (
            <form onSubmit={handleSubmit}>
              <abbr title="Choose profile photo">
                <label
                  htmlFor="file"
                  className="bi bi-camera-fill upload-profile-photo-icon"
                ></label>
              </abbr>
              <input
                style={{ display: "none" }}
                type="file"
                name="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button className="upload-profile-photo-btn" type="submit">
                upload
              </button>
            </form>
          )}
        </div>
        <h1 className="profile-username">{profile?.username}</h1>
        <p className="profile-bio">{profile?.bio}</p>
        <div className="user-date-joined">
          <strong>Data joined: </strong>
          <span>{new Date(profile?.createdAt).toDateString()}</span>
        </div>
        {user?._id === profile?._id && (
          <button
            className="profile-update-btn"
            onClick={() => setUpdateProfile(true)}
          >
            <i className="bi bi-file-person-fill"></i>
            update profile
          </button>
        )}
      </div>
      <div className="profile-posts-list">
        <h2 className="profile-posts-list-title">{profile?.username}</h2>
      </div>
      {user?._id === profile?._id && (
        <button className="delete-account-btn" onClick={deleteAccountHandler}>
          Delete account
        </button>
      )}
      {updateProfile && (
        <UpdateProfile profile={profile} setUpdateProfile={setUpdateProfile} />
      )}
    </section>
  );
};

export default Profile;
