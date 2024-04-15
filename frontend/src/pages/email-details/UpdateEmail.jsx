import { useState } from "react";
// import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  deleteAttachment,
  updateEmail,
} from "../../redux/apiCalls/emailApiCall";
// import { updatePost } from "../../redux/apiCalls/postApiCalls";
// import { fetchCategories } from "../../redux/apiCalls/categoryApiCall";

const UpdateEmail = ({ setUpdateEmail, email }) => {
  const dispatch = useDispatch();
  // let emails = [];
  // for (let i = 0; i < email.to.length; i++) {
  //   emails.push(email.to[i].email);
  // }
  const [to, setTo] = useState(email.to.map((user) => user.email));
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);
  // const [attachment, setAttachment] = useState(
  //   email.attachment.map((item) => item.filename)
  //   // email.attachment
  // );
  const [attachment, setAttachment] = useState(email.attachment);
  const [newAttachment, setNewAttachment] = useState([]);
  const [newEmail, setNewEmail] = useState("");

  const handleFileChange = (e) => {
    console.log("......", e.target.files);
    const files = Array.from(e.target.files);
    console.log("111111111", files);

    setNewAttachment((newAttachment) => [...newAttachment, ...files]);
    console.log("2222222222", newAttachment);
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
    dispatch(deleteAttachment(value._id));
    setAttachment((prevItems) => prevItems.filter((item) => item !== value));
  };
  const handleDeleteNewAttachment = (value) => {
    setNewAttachment((prevItems) => prevItems.filter((item) => item !== value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    to.forEach((item, index) => {
      formData.append(`emails[${index}]`, item);
    });
    formData.append("subject", subject);
    formData.append("body", body);
    // formData.append("attachment", attachment);
    newAttachment.forEach((item) => {
      formData.append(`attachment`, item);
    });

    dispatch(updateEmail(email?._id, formData));

    setUpdateEmail(false);
  };
  return (
    <div className="update-email">
      <form className="update-email-form" onSubmit={handleSubmit}>
        <abbr title="close">
          <i
            className="bi bi-x-circle-fill update-email-form-close"
            onClick={() => setUpdateEmail(false)}
          ></i>
        </abbr>
        <h1 className="update-email-title">Update email</h1>
        <div className="list">
          {to.map((email) => (
            <div className="recipient-email" key={email}>
              <label>{email}</label>
              <button type="button" onClick={() => handleDeleteEmail(email)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ))}
        </div>
        <div>
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
          id=""
          rows="1"
          className="update-email-textarea"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        ></textarea>
        <textarea
          id=""
          rows="5"
          className="update-email-textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <div className="list-attachment">
          {/* Map through the emails array and render each email */}

          {attachment.map((item) => (
            <div className="recipient-email" key={item._id}>
              <label>{item.filename}</label>
              <button type="button">
                <i
                  className="bi bi-x-lg"
                  onClick={() => handleDeleteAttachment(item)}
                ></i>
              </button>
            </div>
          ))}
          <hr />
          {newAttachment.map((item) => (
            <div className="recipient-email" key={item.name}>
              <label>{item.name}</label>
              <button type="button">
                <i
                  className="bi bi-x-lg"
                  onClick={() => handleDeleteNewAttachment(item)}
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
        <button type="submit" className="update-email-btn">
          Update email
        </button>
      </form>
    </div>
  );
};

export default UpdateEmail;
