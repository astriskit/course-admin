import { Spin as ASpin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export const Spin = () => (
  <ASpin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
);
