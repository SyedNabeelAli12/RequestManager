import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import config from "../config";
import userService from "../services/usersApi";
import { useAuth } from "../auth/authContextProvider";
import Loader from "./../components/backdrop";

const RoleAssignment = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // fetches the user
  const fetchUsers = async () => {
    try {
      setOpenBackdrop(true);
      const data = await userService.fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
      alert("Error: " + error.status);
      if (error.status == 452 || error.status == 451) {
        logout();
      }
    } finally {
      setOpenBackdrop(false);
    }
  };

  // autocomplete User Selection handler
  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
  };

  // role change for the user
  const handleRoleChange = (newRole) => {
    if (selectedUser) {
      setSelectedUser({ ...selectedUser, role: newRole });
    }
  };

  // Role for the user update and API call for that purpose
  const updateUserRole = async () => {
    if (!selectedUser) return;

    try {
      setOpenBackdrop(true);
      const updatedUser = await userService.updateUserRole(
        selectedUser.googleId,
        selectedUser.role
      );
      alert(
        `Role updated to ${updatedUser.role} for ${updatedUser.displayName}`
      );
      setSelectedUser(updatedUser);
      // fetchUsers()
    } catch (error) {
      alert("Failed to update role" + error.status);
      if (error.status == 452 || error.status == 451) {
        logout();
      }
    } finally {
      setOpenBackdrop(false);
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 800 }}>
      <Loader open={openBackdrop} />
      <Typography variant="h6" gutterBottom>
        Assign Role to a User
      </Typography>

      <Autocomplete
        options={users}
        getOptionLabel={(option) => option.email || ""}
        onChange={handleUserSelect}
        fullWidth
        renderInput={(params) => (
          <TextField {...params} label="Select User" variant="outlined" />
        )}
        sx={{ marginBottom: 2 }}
      />

      {selectedUser && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Display Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Role</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={selectedUser.googleId}>
                <TableCell>{selectedUser.email}</TableCell>
                <TableCell>{selectedUser.displayName}</TableCell>
                <TableCell>
                  <RadioGroup
                    row
                    value={selectedUser.role}
                    onChange={(event) => handleRoleChange(event.target.value)}
                  >
                    {Object.values(config.roles)
                      .filter((role) => role.activate)
                      .map((role) => (
                        <FormControlLabel
                          value={role.key}
                          control={<Radio />}
                          label={role.description}
                          key={role.key}
                        />
                      ))}
                  </RadioGroup>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updateUserRole}
                  >
                    Save
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default RoleAssignment;
