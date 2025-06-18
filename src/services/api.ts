import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const registrationsApi = {
  createPost: async (data) => {
    try {
      console.log("Sending data to API:", data);
      const response = await api.post("Registration", data);
      return response.data;
    } catch (error) {
      console.error("Error posting entry", error);
      throw error;
    }
  },

  getMyRegistrations: async () => {
    try {
      console.log("fetching registered sessions");
      const response = await api.get("Registration/my-registrations", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching registered sessions");
      throw error;
    }
  },
};

export const sessionsApi = {
  // Get all sessions
  getAll: async () => {
    try {
      const response = await api.get("/Session");
      return response.data;
    } catch (error) {
      console.error("Error fetching sessions", error);
      throw error;
    }
  },

  // Get one session by ID
  getOne: async (id) => {
    try {
      const response = await api.get(`/Session/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching session ${id}`, error);
      throw error;
    }
  },
};
