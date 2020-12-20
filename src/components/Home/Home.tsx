import { GotoLogin } from "../GotoLogin/GotoLogin";

import { Card } from "antd";

export const Home = () => (
  <Card
    className="full-inner-card-body"
    type="inner"
    title="Welcome to the Home!"
  >
    <GotoLogin message="Login to assign courses" />
  </Card>
);
