import { atom } from "jotai";

type Creds = {
  username: string;
  password: string;
};

export const CredsAtom = atom(
  {
    username: sessionStorage.getItem("c1") || "",
    password: sessionStorage.getItem("c2") || "",
  },
  (_, set, update: Creds) => {
    if (update.username && update.password) {
      set(CredsAtom, update);
      sessionStorage.setItem("c1", update.username);
      sessionStorage.setItem("c2", update.password);
    } else {
      set(CredsAtom, { username: "", password: "" });
      sessionStorage.removeItem("c1");
      sessionStorage.removeItem("c2");
    }
  }
);

export const LoggedIn = atom((get) => {
  const { username, password } = get(CredsAtom);
  if (username && password) {
    return true;
  }
  return false;
});

export const initState = {
  students: [],
  courses: [],
  loading: false,
  profile: {
    emailId: "",
    admin: false,
  },
};

type Student = {
  id: string;
  studentId: string;
  name: string;
  emailId: string;
  courses: number[] | [];
};
type Course = {
  id: string;
  courseId: string;
  title: string;
  description: string;
};

export interface AppState {
  students: Student[] | [];
  courses: Course[] | [];
  loading: boolean;
  profile: {
    emailId: string;
    admin?: boolean;
  };
}

export const AppAtom = atom<AppState>(initState);
