
const config = {

  // API endpoints
  apiAuthUrl: process.env.REACT_APP_GOOGLE_API_BASE_URL ,
  apiRequestUrl: process.env.REACT_APP_REQUEST_API ,
  createRequestPath: process.env.REACT_APP_REQUEST_API_CREATE_REQUEST || "/create-request",
  updateRequestPath: process.env.REACT_APP_REQUEST_API_UPDATE_REQUEST || "/update-request",
  fetchRequestPath: process.env.REACT_APP_REQUEST_API_FETCH_REQUEST || "/fetch-request",
  updateRequestStatusPath:
    process.env.REACT_APP_REQUEST_API_UPDATE_REQUEST_STATUS || "/update-request-status",
  usersURL:process.env.REACT_APP_USERS_API_BASE_URL,

  pagination: {
    defaultPage: 0,
    defaultRowsPerPage: 10,
  },

  // Feature flags
  features: {
    enableNewFeature: process.env.REACT_APP_ENABLE_NEW_FEATURE === "true",
  },
  DialogHeader: {
    create: "Create Request",
    update: "Update Request",
    delete: "Delete Request",
    view: "View Request Details",
  },
  flags: {
    create: "create",
    update: "update",
    delete: "delete",
    view: "view",
  },

  status: {
    ST_PENDING: { name: "PENDING", key: "ST_PENDING" },
    ST_APPROVED: { name: "APPROVED", key: "ST_APPROVED" },
    ST_REJECTED: { name: "REJECTED", key: "ST_REJECTED" },
  },
  typeOfRequests: ["Leave", "Overtime", "Equipment"],

  roles: {
    RL_NOTASSIGNED: {
      key: "RL_NOTASSIGNED",
      description: "Not Assigned",
      activate: true,
    },
    RL_CREATOR: { key: "RL_CREATOR", description: "Request Creator", activate: true },
    RL_APPROVER: { key: "RL_APPROVER", description: "Request Approver", activate: true },
    RL_SUPERADMIN: {
      key: "RL_SUPERADMIN",
      description: "Super Admin",
      activate: false,
    }
    
  },
};

export default config;
