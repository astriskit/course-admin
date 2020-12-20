import { default as axios } from "axios";

const origin: string = "http://localhost:3001";
axios.defaults.baseURL = origin;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.put["Content-Type"] = "application/json";

const getUserName = (): string | null => sessionStorage.getItem("c1");
const getPassword = (): string | null => sessionStorage.getItem("c2");

export const login = (username: string, password: string) => {
  return axios.post("/login", { username, password });
};

export const me = () => {
  return axios.get("/me", {
    auth: {
      username: getUserName() || "",
      password: getPassword() || "",
    },
  });
};
