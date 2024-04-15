import request from "../../utils/request";
import { toast } from "react-toastify";
import { emailActions } from "../slices/emailSlice";

//fetch email based status.
export function fetchEmails(status) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/api/emails/status/${status}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(emailActions.setEmails(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//fetch email based on id.
export function fetchEmail(id) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(`/api/emails/${id}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(emailActions.setEmail(data));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//download file.
export function downloadFile(filename) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.get(
        `/api/emails/downloadfile/${filename.filename}`,
        {
          headers: {
            Authorization: getState().auth.user.token,
          },
        }
      );
      await dispatch(emailActions.download(data.file.data));
      console.log(
        "downloadFiledownloadFiledownloadFiledownloadFiledownloadFile"
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//create email
export function createEmail(newEmail) {
  return async (dispatch, getState) => {
    try {
      dispatch(emailActions.setLoading());
      const { data } = await request.post(`/api/emails/create`, newEmail, {
        headers: {
          Authorization: getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(emailActions.setIsEmailCreated(data));
      setTimeout(() => dispatch(emailActions.clearIsEmailCreated()), 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(emailActions.clearLoading());
    }
  };
}

//send email
export function sendEmail(newEmail) {
  return async (dispatch, getState) => {
    try {
      dispatch(emailActions.setLoading());
      const { data } = await request.post(
        `/api/emails/send-internal`,
        newEmail,
        {
          headers: {
            Authorization: getState().auth.user.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(emailActions.setIsEmailSent(data));
      setTimeout(() => dispatch(emailActions.clearIsEmailSent()), 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(emailActions.clearLoading());
    }
  };
}

export function sendInternalEmail(emailId) {
  return async (dispatch, getState) => {
    try {
      dispatch(emailActions.setLoading());
      const { data } = await request.put(
        `/api/emails/send-internal/${emailId}`,
        {},
        {
          headers: {
            Authorization: getState().auth.user.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(emailActions.setIsEmailSent(data));
      setTimeout(() => dispatch(emailActions.clearIsEmailSent()), 3000);
    } catch (error) {
      toast.error(error.response.data.message);
      dispatch(emailActions.clearLoading());
    }
  };
}

//delete email
export function deleteEmail(emailId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(`/api/emails/${emailId}`, {
        headers: {
          Authorization: getState().auth.user.token,
        },
      });
      dispatch(emailActions.deleteEmail(data.email.id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//delete attachment
export function deleteAttachment(attachmentId) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.delete(
        `/api/attachments/${attachmentId}`,
        {
          headers: {
            Authorization: getState().auth.user.token,
          },
        }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

//delete email
export function updateEmail(emailId, updateData) {
  return async (dispatch, getState) => {
    try {
      const { data } = await request.put(`/api/emails/${emailId}`, updateData, {
        headers: {
          Authorization: getState().auth.user.token,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}
