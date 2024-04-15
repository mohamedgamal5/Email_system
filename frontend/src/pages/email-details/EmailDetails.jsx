import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  deleteEmail,
  // downloadFile,
  fetchEmail,
  sendInternalEmail,
} from "../../redux/apiCalls/emailApiCall";
import UpdateEmail from "./UpdateEmail";

const EmailDetails = (status) => {
  const { email } = useSelector((state) => state.email);
  const dispatch = useDispatch();
  const { id } = useParams();
  // const { file } = useSelector((state) => state.email);
  const [updateEmail, setUpdateEmail] = useState(false);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.email);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchEmail(id));

    // dispatch(downloadFile());
  }, [id, setUpdateEmail, updateEmail]);

  // const handleDownload = async (filename) => {
  //   await dispatch(downloadFile({ filename }));
  //   console.log("xxxxxxxxx", file);
  //   if (file) {
  //     // // Create a Blob from the buffer data
  //     // const blob = new Blob([file.file]);
  //     // // Save the Blob as a file using FileSaver.js
  //     // saveAs(blob, filename); // Set desired file name and extension here

  //     const blob = new Blob([file]);
  //     // Create a URL for the Blob
  //     const url = URL.createObjectURL(blob);
  //     // Create a link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", filename); // Set desired file name and extension here
  //     // Append the link to the body
  //     document.body.appendChild(link);
  //     // Trigger the click event on the link
  //     link.click();
  //     // Cleanup
  //     URL.revokeObjectURL(url);
  //     document.body.removeChild(link);
  //   }
  // };

  const handleDelete = async () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteEmail(email?._id));
        navigate(`/`);
      } else {
        swal("Something went wrong!");
      }
    });
  };

  const handleSend = async () => {
    dispatch(sendInternalEmail(email?._id));
    navigate(`/`);
  };
  if (loading) {
    return (
      <div className="profile-loader">
        <Oval
          visible={true}
          height="80"
          width="80"
          color="#00f"
          ariaLabel="oval-loading"
          wrapperStyle={{}}
          secondaryColor="grey"
          strokeWidth={3}
          strokeWidthSecondary={3}
        />
      </div>
    );
  }
  // const handleDownload2 = async (filename) => {
  //   dispatch(downloadFile({ filename }));
  //   const buffer = file;
  //   console.log("buffer", buffer);
  //   if (buffer) {
  //     // Create a Blob from the buffer data
  //     const blob = new Blob([buffer]);
  //     console.log("blob", blob);
  //     // Create a URL for the Blob
  //     const url = URL.createObjectURL(blob);
  //     // Create a link element
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", filename); // Set desired file name here
  //     // Append the link to the body
  //     document.body.appendChild(link);
  //     // Trigger the click event on the link
  //     link.click();
  //     // Cleanup
  //     URL.revokeObjectURL(url);
  //     document.body.removeChild(link);
  //   }
  // };
  return (
    <section className="email-details">
      <div>
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
        <textarea
          className="email-body-details"
          readOnly
          value={email?.body}
        ></textarea>
        {/* <p className="email-body-details">{email?.body}</p> */}
        <strong className="email-attachment"> attachment : </strong>
        {email?.attachment?.map((item) => (
          <span className="email-attachment" key={item?._id}>
            <i className="bi bi-paperclip"></i>
            <a
              href={item?.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              {item?.filename.split("-")[5]}
            </a>
          </span>
        ))}
        {email?.status === "draft" ? (
          <div className="button-list">
            <button className="button" onClick={(e) => handleSend()}>
              <i className="bi bi-send">send</i>
            </button>
            <button className="button" onClick={() => setUpdateEmail(true)}>
              <i className="bi bi-pencil-square"> update</i>
            </button>
            <button className="button" onClick={(e) => handleDelete()}>
              <i className="bi bi-trash">delete</i>
            </button>
            {/* <p>{file}</p> */}
          </div>
        ) : (
          <div>
            <button className="button" onClick={(e) => handleDelete()}>
              <i className="bi bi-trash">delete</i>
            </button>
          </div>
        )}
      </div>
      {updateEmail && (
        <UpdateEmail email={email} setUpdateEmail={setUpdateEmail} />
      )}
    </section>
  );
};

export default EmailDetails;
