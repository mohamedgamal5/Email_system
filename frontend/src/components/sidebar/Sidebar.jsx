import { Link } from "react-router-dom";
import "./sidebar.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = ({ status, setStatus }) => {
  const dispatch = useDispatch();
  const sidebarLinks = [
    { key: 1, value: "inbox" },
    { key: 2, value: "draft" },
    { key: 3, value: "sent" },
  ];
  useEffect(() => {}, []);
  return (
    <div className="sidebar">
      <h5 className="sidebar-title"></h5>
      <ul className="sidebar-links">
        {sidebarLinks.map((sidebarLink) => (
          <Link
            onClick={() => {
              setStatus(sidebarLink.value);
            }}
            className={
              status === sidebarLink.value
                ? "sidebar-link-click"
                : "sidebar-link"
            }
            key={sidebarLink.key}
            to={`/emails/status/${sidebarLink.value}`}
          >
            {sidebarLink.value}
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
