import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, theme, message } from "antd";
import { RiUserAddFill } from "react-icons/ri";
import { FaSignOutAlt } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { GrUpdate } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const { Header, Sider, Content } = Layout;

const LayoutD = () => {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("token");

        navigate("/");
        message.success("Logout Successfully!");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        message.error("Logout failed");
      });
  };

  const user = JSON.parse(sessionStorage.getItem("userData"));
  const parseUser = user.admin;

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
      key: "student",
      icon: <PiStudentFill className="fs-5" />,
      label: "Student",
      children: [
        {
          key: "create-student",
          icon: <PlusOutlined className="fs-5" />,
          label: "Create Student",
        },
        {
          key: "update-student",
          icon: <GrUpdate className="fs-5" />,
          label: "Update Student",
        },
      ],
    },
    {
      key: "create-teacher",
      icon: <RiUserAddFill className="fs-5" />,
      label: "Create Teacher",
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
          <div className="align-items-center">
            <div className=" align-items-center">
              <div>
                {parseUser ? (
                  <>
                    <h5 className="mb-0">{parseUser.name}</h5>
                    <p className="mb-0">{parseUser.email}</p>
                  </>
                ) : (
                  <p>User data not available</p>
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
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutD;
