import React from "react";
import { useAuth } from "../auth/authContextProvider";
import RequestView from "../components/requestViews";
import ButtonAppBar from "../components/layout";
import LoginButton from "../components/loginButton";
import RoleManagement from "./roleManagement";
import config from "../config";

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      {user && localStorage.getItem("jwtToken") ? (
        <div>

          <ButtonAppBar user={user} logout={logout}>
            {user?.role == config.roles.RL_NOTASSIGNED.key ? (
              <>
                <p>Contact Administrator to assign role</p>
              </>
            ) : user?.role == config.roles.RL_SUPERADMIN.key ? (
              <RoleManagement />
            ) : (
              <RequestView user={user} />
            )}
          </ButtonAppBar>
        </div>
      ) : (
        <div>
          <h1>Welcome to the App</h1>
          <p>Please login to continue.</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
};

export default Home;
