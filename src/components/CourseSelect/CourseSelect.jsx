import { Select, Button, message } from "antd";
import { course } from "../../api-service";
import { courses as coursesAtom, axios } from "../../App.atom";
import { useAtom, atom } from "jotai";
import { useUpdateAtom, useAtomValue } from "jotai/utils";
import { ReloadOutlined } from "@ant-design/icons";
import styles from "./CourseSelect.module.css";
import { useEffect } from "react";

const selectLoading = atom(false);

export const CourseSelect = ({
  children: _ = "",
  loading: _loading = false,
  disabled: _disabled = false,
  ...selectProps
} = {}) => {
  const courses = useAtomValue(coursesAtom);
  const [loading, setLoading] = useAtom(selectLoading);
  const request = useUpdateAtom(axios);

  const handleCoursesRefresh = () => {
    setLoading(true);
    request({
      target: coursesAtom,
      handleLoad: false,
      read: course.READ,
      onSuccess: () => {
        setLoading(false);
      },
      onFail: (err) => {
        console.error(err);
        setLoading(false);
        message.error("Reloading courses failed");
      },
      transformData: ({ data }) => data,
    });
  };

  useEffect(() => {
    handleCoursesRefresh();
    //eslint-disable-next-line
  }, []);

  return (
    <div className={styles.courseSelect}>
      <Select
        {...selectProps}
        loading={loading || _loading}
        disabled={loading || _loading || _disabled}
        mode="multiple"
        allowClear
        showSearch
      >
        {courses?.data?.map((course) => (
          <Select.Option key={course.id} value={course.id}>
            {course.title}
          </Select.Option>
        )) ?? null}
      </Select>
      <Button
        icon={<ReloadOutlined />}
        onClick={handleCoursesRefresh}
        disabled={loading || _loading}
      />
    </div>
  );
};
