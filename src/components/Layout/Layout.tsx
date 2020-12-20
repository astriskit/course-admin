import { Layout, Spin, Menu, Card } from "antd";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { useAtom } from "jotai";
import { useHistory } from "react-router-dom";
import {
  LoadingOutlined,
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { AppAtom, CredsAtom, LoggedIn } from "../../App.atom";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [sider, setSider] = useState<boolean>(false);
  const [{ loading }] = useAtom(AppAtom);
  const [, setCreds] = useAtom(CredsAtom);
  const [isLoggedIn] = useAtom(LoggedIn);
  const history = useHistory();

  const logout = () => {
    setCreds({ username: "", password: "" });
  };
  const toggleSider = () => {
    sider ? setSider(false) : setSider(true);
  };

  const handleMenuClick: MenuClickEventHandler = (ev) => {
    const key = ev.key;
    if (key === "logout") {
      logout();
      history.push("/login");
    } else if (key === "student-add") {
      history.push("/student/add");
    } else if (key === "student-edit") {
      history.push("/student/edit");
    } else if (key === "student-list") {
      history.push("/student/list");
    } else if (key === "course-add") {
      history.push("/course/add");
    } else if (key === "course-edit") {
      history.push("/course/edit");
    } else if (key === "course-list") {
      history.push("/course/list");
    }
  };

  return (
    <Layout>
      {isLoggedIn && (
        <Layout.Sider onCollapse={toggleSider} collapsed={!sider} collapsible>
          <Menu mode="inline" onClick={handleMenuClick}>
            <Menu.SubMenu icon={<UserOutlined />} title="Students">
              <Menu.Item key="student-add">Add Student</Menu.Item>
              <Menu.Item key="student-list">List Students</Menu.Item>
              <Menu.Item key="student-edit">Edit Student</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu icon={<FileOutlined />} title="Courses">
              <Menu.Item key="course-add">Add Course</Menu.Item>
              <Menu.Item key="course-list">List Courses</Menu.Item>
              <Menu.Item key="course-edit">Edit Course</Menu.Item>
            </Menu.SubMenu>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
              Logout
            </Menu.Item>
          </Menu>
        </Layout.Sider>
      )}

      <Layout>
        {loading && (
          <Layout.Header className={styles.header}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </Layout.Header>
        )}
        <Layout.Content>
          <Card className={styles.content}>{children}</Card>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
