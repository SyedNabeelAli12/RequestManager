import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import RequestDialog from "./requestDialog.js";
import config from "../config.js";
import { fetchRequests, updateRequestStatus } from "../services/requestApi.js"; // Import API functions
import { useAuth } from "../auth/authContextProvider.js";
import Loader from "./backdrop";

const columns = [
  { id: "id", label: "Id" },
  { id: "title", label: "Title" },
  { id: "description", label: "Description" },
  { id: "type", label: "Type" },
  { id: "urgency", label: "Urgency" },
  { id: "userName", label: "User Name" },
  { id: "creationDate", label: "Creation Date" },
  { id: "approverEmail", label: "Approver Email" },
];

export default function RequestView({ user }) {
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(config.pagination.defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(
    config.pagination.defaultRowsPerPage
  );
  const [totalRequests, setTotalRequests] = useState(0);
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);


  useEffect(() => {
    loadRequests();
  }, [page, rowsPerPage]);

  // function to fetch requests by API call.
  const loadRequests = async () => {
    try {
      setOpenBackdrop(true);
      
      const data = await fetchRequests(user, page, rowsPerPage, id, title);
      // console.log(data)
      setRequests(data.requests);
      setTotalRequests(data.totalRequests);
    } catch (error) {
      alert("Error: " + error.message);
      if (error.status == 452 || error.status == 451) {
        // alert("Error: " + error.status);
        logout();
      }
    }
    finally{
      setOpenBackdrop(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onHandleChangeId = (e) => {
    setId(e.target.value);
  };

  const onHandleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onSearch = () => {
    loadRequests();
  };

  const handleClickOpen = (flag) => {
    setOpen(true);
    setFlag(flag);
  };

  const handleClose = () => {
    setCurrentRequest(null);
    setOpen(false);
  };

  const handleUpdate = (request) => {
    setCurrentRequest(request);
    handleClickOpen(config.flags.update);
  };

  // handle the status update or reject
  const handleStatusUpdate = async (request, status) => {
    try {
      setOpenBackdrop(true);
      await updateRequestStatus(user, request, status);
      alert("Request Status Updated");
      loadRequests();
    } catch (error) {
      alert("Error: " + error.message);
      if (error.status == 452 || error.status == 451) {
        // alert("Error: " + error.status);
        logout();
      }
    }
    finally{
      setOpenBackdrop(false);
    }
  };

  return (
    <>
      <Loader open={openBackdrop} />

      <RequestDialog
        open={open}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
        flag={flag}
        refreshRequest={loadRequests}
        currentRequest={currentRequest}
        user={user}
      />
      <Box sx={{ flexGrow: 1, m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Search with ID"
              id="id"
              value={id}
              onChange={onHandleChangeId}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              label="Search with Title"
              id="title"
              value={title}
              onChange={onHandleChangeTitle}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={3}>
            <Button variant="outlined" color="primary" onClick={onSearch}>
              Search
            </Button>
          </Grid>

          {user.role == config.roles.RL_CREATOR.key ? (
            <Grid item xs={12} sm={4} md={3}>
              <Button
                variant="outlined"
                onClick={() => handleClickOpen(config.flags.create)}
              >
                Add Request
              </Button>
            </Grid>
          ) : (
            ""
          )}

          <Grid item xs={12}>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {requests.length > 0 ? (
                <TableContainer sx={{ maxHeight: 560 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            style={{ minWidth: column.minWidth }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                        <TableCell key={"status"} style={{ minWidth: 170 }}>
                          Status
                        </TableCell>
                        <TableCell key={"actions"} style={{ minWidth: 170 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((row) => (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id];
                            return (
                              <TableCell key={column.id}>
                                {value ? value.toString() : ""}
                              </TableCell>
                            );
                          })}
                          <TableCell key={"Status"}>
                            {config.status[row.status].name}
                          </TableCell>
                          <TableCell key={"actions"}>
                            {user.role === config.roles.RL_CREATOR.key ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                disabled={
                                  config.status.ST_PENDING.key !== row.status
                                }
                                onClick={() => handleUpdate(row)}
                              >
                                Update
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      row,
                                      config.status.ST_APPROVED.key
                                    )
                                  }
                                  disabled={
                                    row.status !== config.status.ST_PENDING.key
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    handleStatusUpdate(
                                      row,
                                      config.status.ST_REJECTED.key
                                    )
                                  }
                                  disabled={
                                    row.status !== config.status.ST_PENDING.key
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                "No Record Found"
              )}
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={totalRequests}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
