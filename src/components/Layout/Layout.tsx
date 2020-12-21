import { Layout, Menu, Card } from "antd";
import { MenuClickEventHandler } from "rc-menu/lib/interface";
import { useState } from "react";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { useHistory } from "react-router-dom";
import {
  UserOutlined,
  FileOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { creds, loggedIn } from "../../App.atom";
import styles from "./Layout.module.css";

export const AppLayout: React.FC = ({ children }) => {
  const [sider, setSider] = useState<boolean>(false);
  const setCreds = useUpdateAtom(creds);
  const isLoggedIn = useAtomValue(loggedIn);
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
    } else if (key === "home") {
      history.push("/");
    }
  };

  return (
    <Layout>
      {isLoggedIn && (
        <Layout.Sider onCollapse={toggleSider} collapsed={!sider} collapsible>
          <Menu mode="inline" onClick={handleMenuClick}>
            <Menu.Item icon={<HomeOutlined />} key="home">
              Home
            </Menu.Item>
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

      <Layout.Content>
        <Card className={styles.content}>{children}</Card>
      </Layout.Content>
    </Layout>
  );
};
