import { useState } from "react";
import HeaderLeft from "./HeaderLeft";
import Navbar from "./Navbar";
import HeaderRight from "./HeaderRight";
//sfc
const Header = ({ status, setStatus }) => {
  const [toggle, setToggle] = useState(false);
  return (
    <header className="header">
      <HeaderLeft toggle={toggle} setToggle={setToggle} />
      <Navbar
        toggle={toggle}
        setToggle={setToggle}
        status={status}
        setStatus={setStatus}
      />
      <HeaderRight />
    </header>
  );
};

export default Header;
