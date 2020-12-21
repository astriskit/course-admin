import { axios } from "../App.atom";
import { useUpdateAtom } from "jotai/utils";
import { useEffect } from "react";

export const useFetch = (requestConfig) => {
  const request = useUpdateAtom(axios);
  useEffect(() => {
    request(requestConfig);
    // eslint-disable-next-line
  }, [request]);
};
