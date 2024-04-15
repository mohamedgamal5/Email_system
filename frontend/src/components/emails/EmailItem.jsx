import { Link } from "react-router-dom";

const EmailItem = ({ email }) => {
  return (
    <div className="email-card">
      <Link className="link" to={`/emails/${email?._id}`}>
        <p className="email-subject">{email?.subject}</p>
        <strong className="strong-email-item">
          {" "}
          from : {email?.from?.email}{" "}
        </strong>
        <br></br>
        <strong className="strong-email-item"> to : </strong>
        {email?.to?.map((item) => (
          <strong className="strong-email-item" key={item?._id}>
            {" "}
            {item?.email}{" "}
          </strong>
        ))}
        <hr className="hr" />

        <p className="email-body">{email?.body}</p>
      </Link>
    </div>
  );
};

export default EmailItem;
