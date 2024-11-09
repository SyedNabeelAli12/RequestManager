import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loader({ open }) {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.modal + 1, // Ensures loader is above modal dialogs
      })}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
