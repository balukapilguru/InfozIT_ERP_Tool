import axios from "axios";
import { toast } from "react-toastify";

// Total Users List
export const getAllUsers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userdata`;
  return axios.get(url);
};

// Paginated Users list
export const getPaginatedUsers = (currentPage, perPage, search, filters) => {
  const url = `${
    import.meta.env.VITE_API_URL
  }/user/list_user?page=${currentPage}&pageSize=${perPage}&search=${search}&filter[branch]=${
    filters.branch
  }&filter[profile]=${filters.profile}&filter[department]=${
    filters.department
  }`;
  return axios.get(url);
};

// Create User
export const createUser = (createUser) => {
  const url = "";
  return toast.promise();
};

// Councellers list
export const getAllCouncellers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userswithcounsellors`;
  return axios.get(url);
};

// without Counsellors list
export const getAllUsersWithOutCouncellers = () => {
  const url = `${import.meta.env.VITE_API_URL}/user/userswithoutcounsellors`;
  return axios.get(url);
};

// Single User by ID
export const getSingleUserById = (UserId) => {
  const url = `${import.meta.env.VITE_API_URL}/user/viewuser/32`;
  return axios.get(url);
};
