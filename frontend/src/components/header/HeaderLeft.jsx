const HeaderLeft = ({ toggle, setToggle }) => {
  return (
    <div className="header-left">
      <div className="header-logo">
        <strong>Email</strong>
        <i className="bi bi-mailbox2-flag"></i>
      </div>
      <div onClick={() => setToggle((prev) => !prev)} className="header-menu">
        {toggle ? (
          <i className="bi bi-x-lg"></i>
        ) : (
          <i className="bi bi-list"></i>
        )}
      </div>
    </div>
  );
};

export default HeaderLeft;
