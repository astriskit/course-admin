import { useHistory } from "react-router-dom";
import { Alert, Button } from "antd";

export const GotoLogin: React.FC<{ message: React.ReactNode }> = ({
  message,
}) => {
  const history = useHistory();
  const handleLogin = () => {
    history.push("/login");
  };
  return (
    <Alert
      showIcon
      message={message}
      action={
        <Button onClick={handleLogin} type="primary">
          Login
        </Button>
      }
    />
  );
};
