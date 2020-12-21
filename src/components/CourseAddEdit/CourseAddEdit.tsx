import { Form, Input, Button, Card, message } from "antd";
import { RouteChildrenProps, useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useUpdateAtom } from "jotai/utils";
import { atom, useAtom } from "jotai";
import { app, axios } from "../../App.atom";
import { course as courseService } from "../../api-service";
import { Course, Reader } from "../../index.types";

const initCourse = {
  id: "",
  courseId: "",
  title: "",
  description: "",
};

const course = atom<Course>(initCourse);

const reader: Reader = (
  id: string,
  onSuccess = (data: any) => {},
  onFail = (err?: any) => {}
) => () => {
  return courseService
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

export const CourseAddEdit: React.FC<RouteChildrenProps> = () => {
  const [{ loading }, setApp] = useAtom(app);
  const [record, setRecord] = useAtom(course);
  const request = useUpdateAtom(axios);
  const [form] = Form.useForm();
  const params = useParams<{ id: string }>();
  const history = useHistory();

  useEffect(() => {
    const id = params.id;
    if (id) {
      request({
        target: course,
        read: reader(id, undefined, () => {
          message.error("Error: Record is not found!");
          history.push("/course/list");
        }),
      });
    } else {
      setRecord(initCourse);
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
        await courseService.UPDATE(record.id, values);
        message.success("Record updated");
      } else {
        const {
          data: { id },
        } = await courseService.CREATE(values);
        message.success("Record added");
        history.push(`/course/edit/${id}`);
      }
    } catch (err) {
      console.error(err.message);
      message.error("Error while saving the record. Try again, later.");
    } finally {
      setApp({ loading: false });
    }
  };

  return (
    <Card
      type="inner"
      loading={loading}
      title={`${record?.id ? "Edit" : "Add"} course`}
      className="full-inner-card-body"
    >
      <Form
        name="addEditCourse"
        form={form}
        initialValues={record}
        onFinish={handleSubmit}
        {...layout}
      >
        <Form.Item
          label="Course id"
          name="courseId"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Field is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{ flex: "auto" }}
          style={{ textAlign: "center" }}
        >
          <Button htmlType="submit" type="primary">
            {record?.id ? "Update " : "Add "} Course
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
