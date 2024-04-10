import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, theme, message } from "antd";
import { FaSignOutAlt } from "react-icons/fa";
import { RxUpdate } from "react-icons/rx";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import { MdOutlineClass } from "react-icons/md";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { Avatar, Drawer } from "antd";
import { useDispatch } from "react-redux";
import { studentLogout } from "../features/auth/authSlice";
const { Header, Sider, Content } = Layout;

const LayoutD = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const showProfile = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const handleSignOut = () => {
    dispatch(studentLogout())
      .unwrap()
      .then(() => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("imgUrl");
        navigate("/");
        message.success("Logout Successfully!");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        message.error("Logout failed");
      });
  };

  const user = JSON.parse(sessionStorage.getItem("userData"));

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const data = [
    {
      key: "",
      icon: <UserOutlined className="fs-5" />,
      label: "Dashboard",
    },
    {
      key: "update",
      icon: <RxUpdate className="fs-5" />,
      label: "Update Details",
    },
    {
      key: "timetable",
      icon: <IoCalendarNumberOutline className="fs-5" />,
      label: "Time-Table",
    },
    {
      key: "attendance",
      icon: <PiChalkboardTeacherDuotone className="fs-5" />,
      label: "Attendance",
    },
    {
      key: "mst",
      icon: <MdOutlineClass className="fs-5" />,
      label: "MST Marks",
    },
    {
      key: "changepassword",
      icon: <MdOutlinePublishedWithChanges className="fs-5" />,
      label: "Update Password",
    },
    {
      key: "signout",
      icon: <FaSignOutAlt className="fs-5" />,
      label: "SignOut",
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <h2 className="text-white fs-5 text-center py-3 mb-0">
            <span className="sm-logo">ERP</span>
            <span className="lg-logo">ERP Login</span>
          </h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[data.key]}
          onClick={({ key }) => {
            if (key === "signout") {
              handleSignOut();
            } else {
              navigate(key);
            }
          }}
          items={data}
        />
      </Sider>
      <Layout>
        <Header
          className="d-flex justify-content-between ps-1 pe-5"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <div>
            <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div>
                {user ? (
                  <>
                    <Avatar
                      style={{ cursor: "pointer", backgroundColor: "#fde3cf", color: "#f56a00" }}
                      size={35}
                      icon={<UserOutlined />}
                      onClick={showProfile}
                    />
                    <Drawer
                      title="Profile"
                      placement="right"
                      closable={true}
                      onClose={onClose}
                      open={visible}
                    >
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", width: "100%" }}>
                        <Avatar
                          size={60}
                          style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                          icon={<UserOutlined />}
                        />
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                      </div>
                      <div style={{ paddingTop: "10px" }}>
                        <button style={{width: "100%",border: "none",backgroundColor: "transparent",padding: "10px",cursor: "pointer",color: "#1890ff",fontWeight: "bold",}} onClick={() => {navigate("/student/profile");onClose()}}>
                          Profile
                        </button>
                        <button style={{width: "100%",border: "none",backgroundColor: "transparent",padding: "10px",cursor: "pointer",color: "#1890ff",fontWeight: "bold"}} onClick={() => {navigate("/student/update");onClose()}}>
                          Update Profile
                        </button>
                        <button style={{width: "100%",border: "none",backgroundColor: "transparent",padding: "10px",cursor: "pointer",color: "#1890ff",fontWeight: "bold"}} onClick={() => {navigate("/student/changepassword");onClose()}}>
                          Update Password
                        </button>
                      </div>
                    </Drawer>
                  </>
                ) : (
                  <h5 className="mb-0">{user.email}</h5>
                )}
              </div>
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            maxHeight: "calc(100vh - 112px)",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutD;
