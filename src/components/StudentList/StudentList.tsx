import { Student } from "../../index.types";
import { app, students, courses, axios } from "../../App.atom";
import { useFetch } from "../../utils";
import { student, course } from "../../api-service";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ColumnsType } from "antd/es/table";
import { Tag, Card, Table } from "antd";
import { Course } from "../../index.types";
import { Link } from "react-router-dom";
import { EditOutlined, UserAddOutlined } from "@ant-design/icons";

const transformData = (res: any): Student[] => res.data;

interface Opts {
  courses: Course[];
}
interface ColGen {
  (opts: Opts): ColumnsType<Student>;
}

const cols: ColGen = ({ courses: _courses }) => [
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
            {_courses.find(({ id }) => crs === id)?.title ?? crs}
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
        student.READ({ pagination: { page, perPage: perPage || 10 } }),
      target: students,
      transformData,
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
        dataSource={data}
        columns={cols({ courses: crses })}
        loading={loading}
        pagination={{ onChange: handlePageChange }}
      />
    </Card>
  );
};
