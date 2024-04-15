import EmailItem from "./EmailItem";
const EmailList = ({ emails }) => {
  return (
    <div className="email-list">
      {emails.map((item) => (
        <EmailItem email={item} key={item._id} />
      ))}
    </div>
  );
};

export default EmailList;
