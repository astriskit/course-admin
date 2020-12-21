import { RouteProps } from "react-router-dom";
import { WritableAtom } from "jotai";
import { AxiosRequestConfig } from "axios";

export type ListOpts = {
  filter?: { key: string; value: string };
  sort?: { order: string; by: string };
  pagination?: {
    page: number;
    perPage: number;
  };
};

export type Creds = {
  username: string;
  password: string;
};

export type Student = {
  id: string;
  studentId: string;
  name: string;
  emailId: string;
  courses: number[] | [];
};

export type Course = {
  id: string;
  courseId: string;
  title: string;
  description: string;
};

export type AppState = {
  listOpts: ListOpts;
  active: {
    student?: string;
    course?: string;
  };
  students: Student[] | [];
  courses: Course[] | [];
  loading: boolean;
  profile: {
    emailId: string;
    admin?: boolean;
  };
};

export type RequestUpdate = {
  target: WritableAtom<any, any>;
  config?: AxiosRequestConfig;
  transformData?(data: any): any;
  read?(): Promise<any>;
};
