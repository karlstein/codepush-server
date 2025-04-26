import axios, { CreateAxiosDefaults } from "axios";
import { toast } from "react-toastify";

export const interceptors: CreateAxiosDefaults = {
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  responseType: "json",
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
};

export const httpClient = axios.create({
  ...interceptors,
});

// httpClient.interceptors.request.use((request) => {
//   return request;
// });

httpClient.interceptors.response.use(
  async (response) => {
    console.log("cp-server - interceptors - response", response);
    return Promise.resolve(response);
  },
  async (error) => {
    console.error("cp-server - interceptors - error", error);
    toast(`Something wrong! ${error}`, { type: "error" });
    // if (
    //   error.response?.status === 401 &&
    //   error.response?.data?.message === "Your access token is expired"
    // ) {
    //   try {
    //     localStorage.clear();
    //     window.location.href = "/";
    //   } catch (errorResponse) {
    //     return Promise.reject(errorResponse);
    //   }
    // }
    return Promise.reject(error);
  }
);
