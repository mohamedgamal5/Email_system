import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createEmail, sendEmail } from "../../redux/apiCalls/emailApiCall";
import { RotatingLines } from "react-loader-spinner";

const CreateEmail = () => {
  const [to, setTo] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState([]);
  const [typeSubmit, setTypeSubmit] = useState("");

  const { loading, isEmailCreated } = useSelector((state) => state.email);
  // const { createEmail } = useSelector((state) => state.email);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isEmailCreated) {
      navigate("/");
    }
  }, [isEmailCreated, navigate]);

  const handleSubmit = (e) => {
    console.log(".>>>>", to);
    e.preventDefault();
    const formData = new FormData();
    to.forEach((item, index) => {
      formData.append(`emails[${index}]`, item);
    });
    formData.append("subject", subject);
    formData.append("body", body);
    // formData.append("attachment", attachment);
    attachment.forEach((item) => {
      formData.append(`attachment`, item);
    });

    if (typeSubmit === "send") {
      dispatch(sendEmail(formData));
    } else {
      dispatch(createEmail(formData));
    }
  };
  //////////////////////////////
  const handleFileChange = (e) => {
    console.log("......", e.target.files);
    const files = Array.from(e.target.files);
    console.log("111111111", files);

    setAttachment([...attachment, ...files]);
    console.log("444444444444444", attachment);
  };
  ////////////////////////////////////
  const handleToEmails = () => {
    if (newEmail.trim() !== "") {
      setTo([...to, newEmail]);
      setNewEmail("");
    }
  };
  ////////////////////////////////////
  const handleDeleteEmail = (value) => {
    setTo((prevItems) => prevItems.filter((item) => item !== value));
  };
  const handleDeleteAttachment = (value) => {
    setAttachment((prevItems) =>
      prevItems.filter((item) => item.name !== value)
    );
  };

  return (
    <section className="create-email">
      <h1 className="create-email-title"> Create new email</h1>
      <form className="create-email-form" onSubmit={handleSubmit}>
        <label>to:</label>
        <ul>
          {/* Map through the emails array and render each email */}
          {to.map((email) => (
            <div className="recipient-email" key={email}>
              <label>{email}</label>
              <button type="button" onClick={() => handleDeleteEmail(email)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ))}
        </ul>
        <div className="email">
          <input
            type="email"
            placeholder="Enter email"
            value={newEmail}
            className="create-email-input"
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            type="button"
            className="add-email-btn"
            onClick={handleToEmails}
          >
            Add Email
          </button>
        </div>
        <textarea
          className="create-email-textarea"
          placeholder="Subject"
          rows="1"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        ></textarea>
        <textarea
          className="create-email-textarea"
          placeholder="Body"
          rows="5"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <div>
          {/* Map through the emails array and render each email */}

          {attachment.map((email) => (
            <div className="recipient-email" key={email.name}>
              <label>{email.name}</label>
              <button type="button">
                <i
                  className="bi bi-x-lg"
                  onClick={() => handleDeleteAttachment(email.name)}
                ></i>
              </button>
            </div>
          ))}
        </div>
        <input
          multiple
          type="file"
          name="file"
          id="file"
          className="create-email-upload"
          onChange={(e) => handleFileChange(e)}
        />
        <div className="btns">
          <button
            className="create-email-btn"
            type="submit"
            value="create"
            onClick={(e) => setTypeSubmit(e.target.value)}
          >
            {loading ? (
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="blue"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Create"
            )}
          </button>
          <button
            className="create-email-btn"
            type="submit"
            value="send"
            onClick={(e) => setTypeSubmit(e.target.value)}
          >
            {loading ? (
              <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="blue"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              "Send"
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateEmail;
