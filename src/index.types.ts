import { WritableAtom } from "jotai";
import { AxiosRequestConfig } from "axios";
import { ColumnsType } from "antd/es/table";

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

export interface OnSuccess {
  (data: any): void;
}
export interface OnFail {
  (data: any): void;
}
export type PromiseCB = {
  (): Promise<any>;
};
export interface Reader {
  (
    id: string,
    onSuccess: OnSuccess | undefined,
    onFail: OnFail | undefined
  ): PromiseCB;
}

export type RequestUpdate = {
  target: WritableAtom<any, any>;
  config?: AxiosRequestConfig;
  transformData?(data: any): any;
  read?(): Promise<any>;
  handleLoad?: boolean;
  onFail?: OnFail;
  onSuccess?: OnSuccess;
  deleteId?: string;
  deleteKey?: string;
};

export interface DeleteCB {
  (): Promise<any> | void;
}

export interface Opts {
  courses?: Course[];
  genDelete(id: string): DeleteCB;
}

export interface ColGen<T> {
  (opts: Opts): ColumnsType<T>;
}

export type ListData<T> = {
  data: T[];
  total: number;
};
