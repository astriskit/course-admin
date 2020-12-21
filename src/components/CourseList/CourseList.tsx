import { app, courses, axios } from "../../App.atom";
import { useFetch } from "../../utils";
import { course } from "../../api-service";
import { Course, ColGen, ListData } from "../../index.types";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { Tag, Card, Table, Button } from "antd";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const transformData = (res: any): ListData<Course> => res.data;

export const cols: ColGen<Course> = ({ genDelete }) => [
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
  {
    title: "Delete",
    key: "action-delete",
    render: (_, { id }) => (
      <Button
        type="text"
        icon={<DeleteOutlined />}
        onClick={genDelete(id)}
        danger
      />
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

  const genDelete = (id: string) => () => {
    request({
      read: () => course.DELETE(id),
      target: courses,
      deleteId: id,
    });
  };

  return (
    <Card
      className="full-inner-card-body"
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
        dataSource={data.data}
        columns={cols({ genDelete })}
        loading={loading}
        pagination={{ onChange: handlePageChange, total: data.total }}
      />
    </Card>
  );
};
