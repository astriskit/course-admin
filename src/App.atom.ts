import { atom } from "jotai";
import { Creds, RequestUpdate, Course, Student } from "./index.types";
import { default as gAxios } from "axios";

export const creds = atom(
  {
    username: sessionStorage.getItem("c1") || "",
    password: sessionStorage.getItem("c2") || "",
  },
  (_, set, update: Creds) => {
    if (update.username && update.password) {
      set(creds, update);
      sessionStorage.setItem("c1", update.username);
      sessionStorage.setItem("c2", update.password);
    } else {
      set(creds, { username: "", password: "" });
      sessionStorage.removeItem("c1");
      sessionStorage.removeItem("c2");
    }
  }
);

export const loggedIn = atom((get) => {
  const { username, password } = get(creds);
  if (username && password) {
    return true;
  }
  return false;
});

export const profile = atom({
  emailId: "",
  admin: false,
});

export const students = atom<{ data: Student[]; total: number }>({
  data: [],
  total: 0,
});

export const courses = atom<{ data: Course[]; total: number }>({
  data: [],
  total: 0,
});

export const app = atom({
  loading: false,
});

export const axios = atom(null, async (get, set, update: RequestUpdate) => {
  const {
    target,
    config,
    transformData,
    read,
    handleLoad = true,
    onSuccess,
    onFail,
    deleteId,
    deleteKey = "id",
  } = update;
  if (target && (read || config)) {
    try {
      handleLoad && set(app, { loading: true });
      let data = null;
      if (read) {
        data = await read();
      } else if (config) {
        const { data: d } = await gAxios(config);
        data = d;
      }
      if (transformData) {
        data = transformData(data);
      }
      if (deleteId) {
        let targetData = get(target);
        targetData.data = targetData.data.filter(
          (d: any) => d[deleteKey] !== deleteId
        );
        targetData.count += 1;
        set(target, targetData);
      } else {
        set(target, data);
      }
      handleLoad && set(app, { loading: false });
      onSuccess && onSuccess(data);
    } catch (err) {
      console.error(err, "axios-atom");
      if (onFail) {
        onFail(err);
      } else {
        throw err;
      }
    } finally {
      handleLoad && set(app, { loading: false });
    }
  } else {
    throw new Error("'target' and/or 'config' must be defined");
  }
});
