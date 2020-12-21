import { Form, Input, Select, Button, Card, message } from "antd";
import { useEffect } from "react";
import { app, axios } from "../../App.atom";
import { useUpdateAtom } from "jotai/utils";
import { atom, useAtom } from "jotai";
import { student as studentService } from "../../api-service";
import { Student } from "../../index.types";
import { RouteChildrenProps, useParams, useHistory } from "react-router-dom";

const initStudent = {
  id: "",
  studentId: "",
  name: "",
  emailId: "",
  courses: [],
};

const student = atom<Student>(initStudent);

interface OnSuccess {
  (data: any): void;
}
interface OnFail {
  (data: any): void;
}
type PromiseCB = {
  (): Promise<any>;
};
interface Reader {
  (
    id: string,
    onSuccess: OnSuccess | undefined,
    onFail: OnFail | undefined
  ): PromiseCB;
}

const reader: Reader = (
  id: string,
  onSuccess = (data: any) => {},
  onFail = (err?: any) => {}
) => () => {
  return studentService
    .READ_ONE(id)
    .then(({ data }) => {
      onSuccess && onSuccess(data);
      return data;
    })
    .catch((err) => {
      onFail && onFail(err);
      console.error(err.message);
    });
};

export const StudentAddEdit: React.FC<RouteChildrenProps> = () => {
  const [{ loading }, setApp] = useAtom(app);
  const [record, setRecord] = useAtom(student);
  const request = useUpdateAtom(axios);
  const [form] = Form.useForm();
  const params = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const id = params.id;
    if (id) {
      request({
        target: student,
        read: reader(id, undefined, () => {
          message.error("Error: Record is not found!");
          history.push("/student/list");
        }),
      });
    } else {
      setRecord(initStudent);
    }
  }, [params, request, history, setRecord]);

  useEffect(() => {
    if (form) {
      form.setFieldsValue(record);
    }
  }, [record, form]);

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const handleSubmit = async (values: any) => {
    try {
      setApp({ loading: true });
      if (record.id) {
        await studentService.UPDATE(record.id, values);
        message.success("Record updated");
      } else {
        const {
          data: { id },
        } = await studentService.CREATE(values);
        message.success("Record added");
        history.push(`/student/edit/${id}`);
      }
    } catch (err) {
      console.error(err.message);
      message.error("Error while saving the record. Try again, later.");
    } finally {
      setApp({ loading: false });
    }
  };

  return (
    <Card type="inner" loading={loading}>
      <Form
        name="addEditStudent"
        form={form}
        initialValues={record}
        onFinish={handleSubmit}
        {...layout}
      >
        <Form.Item
          label="Student id"
          name="studentId"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email-id"
          name="emailId"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Courses" name="courses">
          <Select />
        </Form.Item>

        <Form.Item
          wrapperCol={{ flex: "auto" }}
          style={{ textAlign: "center" }}
        >
          <Button htmlType="submit" type="primary">
            {record?.id ? "Update " : "Add "} Student
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
