import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Link, useLocation, Outlet } from "react-router";

const { Header, Sider, Content } = Layout;

const SIDEBAR_WIDTH = 220;
const HEADER_HEIGHT = 64;

const DashboardLayout = () => {
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Fixed Sidebar */}
      <Sider
        width={SIDEBAR_WIDTH}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "1.1rem",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          My App
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Dashboard Home</Link>
          </Menu.Item>
          <Menu.Item key="/sales-orders" icon={<FileTextOutlined />}>
            <Link to="/sales-orders">Sales Orders</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content Layout */}
      <Layout
        style={{
          marginLeft: SIDEBAR_WIDTH,
        }}
      >
        {/* Fixed Header */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            height: HEADER_HEIGHT,
            position: "fixed",
            left: SIDEBAR_WIDTH,
            right: 0,
            top: 0,
            zIndex: 90,
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 500 }}>
            Dashboard
          </h1>
        </Header>

        {/* Main Content */}
        <Content
          style={{
            padding: 24,
            background: "#f9f9f9",
            marginTop: HEADER_HEIGHT,
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
