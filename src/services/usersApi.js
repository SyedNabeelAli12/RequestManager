import axios from "axios";
import config from "../config";
import { encryptData } from "../utils/encryption";

const API_URL = config.usersURL + "/api/users";



const userService = {
  // Fetch all users
  fetchAllUsers: async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      return response.data;
    } catch (error) {
      // throw new Error("Error fetching users: " + error.message);
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (googleId, role) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      let packet =  {
        googleId,
        role,
      }
     let encryptedData = encryptData(packet)
      
      const response = await axios.put(
        `${API_URL}/role`,
        {
       data:encryptedData
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      // throw new Error("Error updating role: " + error.message);
      throw error;
    }
  },
};

export default userService;
