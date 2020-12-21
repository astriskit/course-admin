import { app, courses, axios } from "../../App.atom";
import { useFetch } from "../../utils";
import { course } from "../../api-service";
import { Course } from "../../index.types";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ColumnsType } from "antd/es/table";
import { Tag, Card, Table } from "antd";
import { Link } from "react-router-dom";
import { EditOutlined, UserAddOutlined } from "@ant-design/icons";

const transformData = (res: any): Course[] => res.data;

export const cols: ColumnsType<Course> = [
  {
    title: "Course Id",
    dataIndex: "courseId",
    key: "course-id",
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Edit",
    key: "action-edit",
    render: (_, { id }) => (
      <Link to={`/course/edit/${id}`}>
        <EditOutlined />
      </Link>
    ),
  },
];

export const CourseList = () => {
  const { loading } = useAtomValue(app);
  const data = useAtomValue(courses);
  const request = useUpdateAtom(axios);

  useFetch({
    target: courses,
    read: () => course.READ(),
    transformData,
  });

  const handlePageChange = (page: number, perPage?: number) => {
    request({
      read: () => course.READ({ pagination: { page, perPage: perPage || 10 } }),
      target: courses,
      transformData,
    });
  };

  return (
    <Card
      type="inner"
      title="List of courses"
      extra={[
        <Link to="/course/add" key="add">
          <Tag color="blue" icon={<UserAddOutlined />}>
            Add more course
          </Tag>
        </Link>,
      ]}
    >
      <Table<Course>
        rowKey={({ id }) => id}
        dataSource={data}
        columns={cols}
        loading={loading}
        pagination={{ onChange: handlePageChange }}
      />
    </Card>
  );
};
