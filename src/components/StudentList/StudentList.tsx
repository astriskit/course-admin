import { Student } from "../../index.types";
import { app, students, courses, axios } from "../../App.atom";
import { useFetch } from "../../utils";
import { student, course } from "../../api-service";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { ColGen, ListData, Course } from "../../index.types";
import { Tag, Card, Table, Button, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
  EditOutlined,
  UserAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const transformData = (res: any): ListData<Student> => res.data;

const renderCourses = (_courses: Course[] | undefined) => (crses: string[]) =>
  crses.map((crs: string, index: number) => (
    <Tag color="blue" key={index}>
      <Link to={`/course/edit/${crs}`}>
        {_courses?.find(({ id }) => crs === id)?.title ?? crs}
      </Link>
    </Tag>
  ));

const renderEmail = (val: string) => <a href={`mailto:${val}`}>{val}</a>;

const cols: ColGen<Student> = ({ courses: _courses, genDelete }) => [
  {
    title: "Student Id",
    dataIndex: "studentId",
    key: "student-id",
    responsive: ["lg"],
    width: 110,
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
    responsive: ["lg"],
    render: renderEmail,
    ellipsis: true,
  },
  {
    title: "Courses",
    dataIndex: "courses",
    key: "courses",
    responsive: ["md"],
    render: renderCourses(_courses),
    ellipsis: true,
  },
  {
    title: "Edit",
    width: 80,
    key: "action-edit",
    align: "center",
    render: (_, { id }) => (
      <Link to={`/student/edit/${id}`}>
        <EditOutlined />
      </Link>
    ),
  },
  {
    title: "Delete",
    key: "action-delete",
    width: 80,
    align: "center",
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
    read: () => student.READ({ pagination: { page: 1, perPage: 10 } }),
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
        scroll={{
          y: 420,
        }}
        size="middle"
        expandable={{
          rowExpandable: (record) => Boolean(record.courses.length),
          expandedRowRender: (record) => {
            const recCrses = record.courses;
            const recCrsesStr: string[] = [];
            for (const crses of recCrses) {
              recCrsesStr.push(crses.toString(10));
            }
            return (
              <>
                <Row>
                  <Col>Email:&nbsp;</Col>
                  <Col>{renderEmail(record.emailId)}</Col>
                </Row>
                <Row>
                  <Col>List of courses assigned:&nbsp;</Col>
                  <Col>{renderCourses(crses.data)(recCrsesStr)}</Col>
                </Row>
              </>
            );
          },
        }}
      />
    </Card>
  );
};
