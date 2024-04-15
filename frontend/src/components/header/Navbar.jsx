import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchEmails } from "../../redux/apiCalls/emailApiCall";
const Navbar = ({ toggle, setToggle, status, setStatus }) => {
  const { user } = useSelector((state) => state.auth);
  const Links = [
    { key: 1, value: "inbox", icon: "bi bi-inbox" },
    { key: 2, value: "draft", icon: "bi bi-file-earmark-text" },
    { key: 3, value: "sent", icon: "bi bi-send" },
  ];
  const { status2 } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  useEffect(() => {
    dispatch(fetchEmails(status));
  }, [status]);
  return (
    <nav
      style={{
        clipPath: toggle && "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      }}
      className="navbar"
    >
      <ul className="nav-links">
        {user ? (
          <>
            <Link
              to="create-email"
              onClick={() => setToggle(false)}
              className="nav-link"
            >
              <i className="bi bi-pencil"></i>Create
            </Link>
          </>
        ) : (
          <></>
        )}
        {/* <Link to="/" onClick={() => setToggle(false)} className="nav-link">
          <i className="bi bi-house"></i>Home
        </Link> */}
        {Links.map((link) => (
          <Link
            onClick={() => {
              setStatus(link.value);
              setToggle(false);
            }}
            className={status2 === link.value ? "nav-link-active" : "nav-link"}
            key={link.key}
            to={`/emails/status/${link.value}`}
          >
            <i className={link.icon}></i>
            {link.value}
          </Link>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
