import { useEffect } from "react";
import EmailList from "./../../components/emails/EmailsList";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchEmails } from "../../redux/apiCalls/emailApiCall";
import { useParams } from "react-router-dom";

const Home = ({ status }) => {
  const dispatch = useDispatch();
  // const [status, setStatus] = useState("inbox");
  const { emails } = useSelector((state) => state.email);
  const { status2 } = useParams();
  useEffect(() => {
    if (status2) {
      if (status !== status2) {
        dispatch(fetchEmails(status2));
      }
    } else {
      dispatch(fetchEmails(status));
    }
  }, [status, status2]);
  return (
    <section className="home">
      <div className="home-hero-header">
        <div className="home-hero-header-layout">
          <h1 className="home-title">{status || status2} emails</h1>
        </div>
      </div>
      <div className="home-container">
        {/* <Sidebar className="sidebar" status={status} setStatus={setStatus} /> */}
        <EmailList className="emailList" emails={emails} />
      </div>
    </section>
  );
};

export default Home;
