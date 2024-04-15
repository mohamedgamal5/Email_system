import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/apiCalls/authApiCall";

const HeaderRight = () => {
  const [dropdown, setDropdown] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutUser());
    setDropdown(false);
  };
  return (
    <div className="header-right">
      {user ? (
        <>
          <div className="header-right-user-info">
            <span
              className="header-right-username"
              onClick={() => setDropdown((prev) => !prev)}
            >
              {user?.username}
            </span>
            <img
              src={
                // user?.profilePhoto?.publicId
                user?.profilePhoto?.url
                // : "/images/image.png"
              }
              alt="user photo"
              className="header-right-user-photo"
            />
            {dropdown && (
              <div className="header-right-dropdown">
                <Link
                  to={`/profile/${user?._id}`}
                  className="header-dropdown-item"
                  onClick={() => setDropdown((prev) => !prev)}
                >
                  <i className="bi ib-file-person"></i>
                  <span>Profile</span>
                </Link>
                <Link to={`/`}>
                  <div className="header-dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-in-left"></i>
                    <span>Logout</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link to="/login" className="header-right-link">
            <i className="bi bi-box-arrow-in-right"></i>
            <span>Login</span>
          </Link>
          <Link to="register" className="header-right-link">
            <i className="bi bi-person-plus"></i>
            <span>Register</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default HeaderRight;
