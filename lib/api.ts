import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`  ,
  withCredentials: true, // allows sending or receiving httpOnly cookies
});

export default api;