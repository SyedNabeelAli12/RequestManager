import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import config from "../config.js";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { submitRequest, fetchRequests } from "../services/requestApi.js";
import { useAuth } from "../auth/authContextProvider.js";
import Loader from './backdrop';

export default function RequestDialog({
  open,
  handleClickOpen,
  handleClose,
  flag,
  refreshRequest,
  currentRequest,
  user,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [type, setType] = useState("");
  const [approverEmail, setApproverEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const urgencyOptions = ["Low", "Medium", "High"];
  const { logout } = useAuth();
  // function to reset the form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrgency("");
    setType("");
    setApproverEmail("");
    setEmailError("");
  };

  // Is used to populate the fields or reset
  useEffect(() => {
    if (currentRequest) {
      setTitle(currentRequest.title);
      setDescription(currentRequest.description);
      setUrgency(currentRequest.urgency);
      setType(currentRequest.type);
      setApproverEmail(currentRequest.approverEmail);
    } else {
      resetForm();
    }
  }, [currentRequest, open]);

  // handle form submission and API call.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !urgency ||
      !type ||
      !approverEmail ||
      emailError
    ) {
      alert("All fields are required and email must be valid!");
      return;
    }

    const requestData = {
      id: currentRequest?.id || undefined,
      title,
      description,
      urgency,
      type,
      approverEmail,
      userName: user.displayName,
      user,
      userEmail: user.email,
      status: currentRequest?.status,
    };

    try {
      setOpenBackdrop(true);

      await submitRequest(requestData, flag);
    } catch (error) {
      alert("Error: " + error.message);
      if (error.status == 452 || error.status == 451) {
        // alert("Error: " + error.message);
        logout();
      }
    } finally {
      refreshRequest(user);
      handleClose();
      resetForm();
      setOpenBackdrop(false);
    }
  };

  //handle field changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "title":
        setTitle(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "approverEmail":
        if (value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setEmailError("");
        } else {
          setEmailError("Invalid email format");
        }
        setApproverEmail(value);
        break;
      default:
        break;
    }
  };

  // Check box handling for the urgency field
  const handleUrgencyChange = (event) => {
    setUrgency(event.target.value);
  };

  return (
    <React.Fragment>
    <Loader open={openBackdrop}/>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {config.DialogHeader[flag]}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Title"
                id="title"
                value={title}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <TextField
                fullWidth
                label="Description of Request"
                id="description"
                value={description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Autocomplete
                disablePortal
                options={config.typeOfRequests}
                onChange={(event, newValue) => {
                  setType(newValue);
                }}
                value={type}
                id="type"
                renderInput={(params) => (
                  <TextField {...params} label="Type of Request" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <TextField
                fullWidth
                label="Approver Email"
                id="approverEmail"
                value={approverEmail}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
                disabled={config.flags.update == flag}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <FormGroup>
                Urgency
                {urgencyOptions.map((option) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={urgency === option}
                        onChange={handleUrgencyChange}
                        value={option}
                      />
                    }
                    label={option}
                    key={option}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus>
            {flag === config.flags.create
              ? config.flags.create
              : config.flags.update}
          </Button>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
