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

const HomeMenu = () => {
  const setCreds = useUpdateAtom(creds);
  const history = useHistory();
  const logout = () => {
    setCreds({ username: "", password: "" });
  };
  const handleMenuClick: MenuClickEventHandler = (ev) => {
    const key = ev.key;
    if (key === "logout") {
      logout();
      history.push("/login");
    } else if (key === "student-add") {
      history.push("/student/add");
    } else if (key === "student-list") {
      history.push("/student/list");
    } else if (key === "course-add") {
      history.push("/course/add");
    } else if (key === "course-list") {
      history.push("/course/list");
    } else if (key === "home") {
      history.push("/");
    }
  };
  return (
    <Menu
      mode="inline"
      onClick={handleMenuClick}
      className={styles.menu}
      defaultSelectedKeys={["home"]}
    >
      <Menu.Item icon={<HomeOutlined />} key="home">
        Home
      </Menu.Item>
      <Menu.SubMenu icon={<UserOutlined />} title="Students">
        <Menu.Item key="student-add">Add Student</Menu.Item>
        <Menu.Item key="student-list">List Students</Menu.Item>
      </Menu.SubMenu>
      <Menu.SubMenu icon={<FileOutlined />} title="Courses">
        <Menu.Item key="course-add">Add Course</Menu.Item>
        <Menu.Item key="course-list">List Courses</Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );
};

export const AppLayout: React.FC = ({ children }) => {
  const [sider, setSider] = useState<boolean>(false);
  const [collapsedWidth, setCollapsedWidth] = useState<number>(80);
  const isLoggedIn = useAtomValue(loggedIn);

  const toggleSider = () => {
    sider ? setSider(false) : setSider(true);
  };

  const handleBreakPoint = (broken: any) => {
    if (broken) {
      setCollapsedWidth(0);
    } else {
      setCollapsedWidth(80);
    }
  };

  return (
    <Layout>
      {isLoggedIn && (
        <Layout.Sider
          className={styles.sider}
          breakpoint="lg"
          onCollapse={toggleSider}
          collapsed={!sider}
          onBreakpoint={handleBreakPoint}
          collapsedWidth={collapsedWidth}
          zeroWidthTriggerStyle={{
            top: "10px",
            background: "white",
            color: "black",
            boxShadow: "2px 2px whitesmoke",
          }}
          collapsible
        >
          <HomeMenu />
        </Layout.Sider>
      )}

      <Layout.Content>
        <Card className={styles.content}>{children}</Card>
      </Layout.Content>
    </Layout>
  );
};
