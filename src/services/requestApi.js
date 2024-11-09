import axios from "axios";
import config from "../config.js";
import { encryptData } from "./../utils/encryption";

let API_BASE_URL = config.apiRequestUrl + "/api/requests";

// Fetches requests based on pagination and filters
export const fetchRequests = async (
  user,
  page,
  rowsPerPage,
  id = "",
  title = ""
) => {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!user) throw new Error("No User Found");

  // await axios.get("https://localhost:3002/api/requests/fetch-request", {
  //   headers: {
  //     Authorization: `Bearer ${jwtToken}`,
  //   },
  //   params: {
  //     page,
  //     rowsPerPage,
  //     id,
  //     title,
  //     email: user.email,
  //     role: user.role,
  //   },
  //   withCredentials: true,
  // });

  let data = encryptData({
    page,
    rowsPerPage,
    id,
    title,
    email: user.email,
    role: user.role,
  });

  try {
    const response = await axios.get(API_BASE_URL + config.fetchRequestPath, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      params: {
        data: data,
      },
    });
    return response.data;
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 451 || error.response.status === 452)
    ) {
      localStorage.clear();
      window.location.reload();
    } else {
      console.error("Error fetching requests:", error);
      throw error;
    }
  }
};

// Updates whether approve or reject based on the status of a request
export const updateRequestStatus = async (user, request, status) => {
  const jwtToken = localStorage.getItem("jwtToken");
  let packet = {
    ...request,
    user,
    approver: user.displayName,
    status,
  };

  let encryptedData = encryptData(packet);

  if (!user) throw new Error("No User Found");

  try {
    await axios.post(
      API_BASE_URL + config.updateRequestStatusPath,
      {
        data: encryptedData,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return "Request Status Updated";
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 451 || error.response.status === 452)
    ) {
      localStorage.clear();
      window.location.reload();
    } else {
      console.error("Error fetching requests:", error);
      throw error;
    }
  }
};

// Submits a new or updated request uses two URL hits URL based on the flag provided.
export const submitRequest = async (requestData, flag) => {
  const jwtToken = localStorage.getItem("jwtToken");

  let encryptedData = encryptData(requestData);

  const URLString =
    flag === config.flags.update
      ? API_BASE_URL + config.updateRequestPath
      : API_BASE_URL + config.createRequestPath;

  try {
    await axios.post(
      URLString,
      { data: encryptedData },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return "Request submitted successfully";
  } catch (error) {
    if (
      error.response &&
      (error.response.status === 451 || error.response.status === 452)
    ) {
      localStorage.clear();
      window.location.reload();
    } else {
      console.error("Error fetching requests:", error);
      throw error;
    }
  }
};
