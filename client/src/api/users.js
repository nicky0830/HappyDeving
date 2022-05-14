import axios from "axios";
import { REACT_APP_API_URL } from "../config";
import authHeader from "../features/user/authHeader";

axios.defaults.baseURL = `${REACT_APP_API_URL}`;
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  "Content-Type": "application/json",
  ...authHeader(),
};

export const signupApi = (data) => axios.post("/users/signup", data);

export const verifyEmailApi = (id, accessToken) => axios.get(`/users/${id}/verify/${accessToken}`);

export const signinApi = (data) => axios.post("/users/signin", data);

export const signoutApi = () => axios.post("/users/signout");

export const getProfileApi = (id) => axios.get(`/mypage/${id}`);

export const editProfileApi = (id, data) => axios.patch(`/mypage/${id}`, data);

export const deleteUserApi = (data) => axios.delete(`/users/withdrawal/${data.id}`, { data: data });

export const editProfileImageApi = (id, data) => axios.post(`/mypage/image/${id}`, data);
