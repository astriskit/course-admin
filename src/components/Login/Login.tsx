import { Form, Input, Button, message, Card } from "antd";
import { useAtom } from "jotai";
import { useHistory } from "react-router-dom";
import { login } from "../../api-service";
import { app, creds } from "../../App.atom";
import { useUpdateAtom } from "jotai/utils";
import styles from "./Login.module.css";

export const Login = () => {
  const [{ loading }, setState] = useAtom(app);
  const setCreds = useUpdateAtom(creds);
  const history = useHistory();

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  //@ts-ignore
  const handleSubmit = async ({ username, password }) => {
    try {
      setState({ loading: true });
      await login(username, password);
      setCreds({ username, password });
      setState({ loading: false });
      history.push("/");
    } catch (error) {
      console.error(error.message);
      message.error("Login failed. Check username and/or password.");
      setState({ loading: false });
    }
  };
  return (
    <Card
      type="inner"
      title="Please login!"
      className={`full-inner-card-body ${styles.card}`}
    >
      <Form onFinish={handleSubmit}>
        <Form.Item
          {...layout}
          name="username"
          label="User"
          rules={[{ required: true, message: "Username is required!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          {...layout}
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
