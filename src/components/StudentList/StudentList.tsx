import { Student } from "../../index.types";
import { app, students, courses, axios } from "../../App.atom";
import { useFetch } from "../../utils";
import { student, course } from "../../api-service";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ColGen, ListData } from "../../index.types";
import { Tag, Card, Table, Button } from "antd";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const transformData = (res: any): ListData<Student> => res.data;

const cols: ColGen<Student> = ({ courses: _courses, genDelete }) => [
  {
    title: "Student Id",
    dataIndex: "studentId",
    key: "student-id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email-id",
    dataIndex: "emailId",
    key: "email-id",
  },
  {
    title: "Courses",
    dataIndex: "courses",
    key: "courses",
    render: (crses) =>
      crses.map((crs: string, index: number) => (
        <Tag color="blue" key={index}>
          <Link to={`/course/edit/${crs}`}>
            {_courses?.find(({ id }) => crs === id)?.title ?? crs}
          </Link>
        </Tag>
      )),
  },
  {
    title: "Edit",
    key: "action-edit",
    render: (_, { id }) => (
      <Link to={`/student/edit/${id}`}>
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

export const StudentList = () => {
  const { loading } = useAtomValue(app);
  const data = useAtomValue(students);
  const request = useUpdateAtom(axios);
  const crses = useAtomValue(courses);

  useFetch({
    target: students,
    read: () => student.READ(),
    transformData,
  });
  useFetch({
    target: courses,
    read: () => course.READ(),
    transformData,
  });

  const handlePageChange = (page: number, perPage?: number) => {
    request({
      read: () =>
        student.READ({
          pagination: { page, perPage: perPage || 10 },
        }),
      target: students,
      transformData,
    });
  };

  const genDelete = (id: string) => () => {
    request({
      read: () => student.DELETE(id),
      target: students,
      deleteId: id,
    });
  };

  return (
    <Card
      className="full-inner-card-body"
      type="inner"
      title="List of students"
      extra={[
        <Link to="/student/add" key="add">
          <Tag color="blue" icon={<UserAddOutlined />}>
            Add more student
          </Tag>
        </Link>,
      ]}
    >
      <Table<Student>
        rowKey={({ id }) => id}
        dataSource={data.data}
        columns={cols({ courses: crses.data, genDelete })}
        loading={loading}
        pagination={{ onChange: handlePageChange, total: data.total }}
      />
    </Card>
  );
};
