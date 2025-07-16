import React, { useEffect } from "react";
import { Button, Space, Divider, message, Layout } from "antd";
import { PlusOutlined, FileTextOutlined, ExportOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesOrders } from "../stores/salesOrderSlice";
import type { RootState, AppDispatch } from "../stores/store";
import { writeFile, utils } from "xlsx";
import SalesOrderForm from "../components/SalesOrderForm";
import SalesOrderList from "../components/SalesOrderList";

export const SalesOrderPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { salesOrders, loading, error } = useSelector((state: RootState) => state.salesOrder);
  const [view, setView] = React.useState<"form" | "list">("list");

  useEffect(() => {
    if (view === "list") {
      dispatch(fetchSalesOrders());
    }
  }, [view, dispatch]);

  const handleExport = async () => {
    try {
      const formattedSalesOrders = salesOrders.map((order) => ({
        "Sales Order No": order.soNumber,
        "Customer Name": order.customer?.name,
        "Customer PO": order.customerPO,
        "Transaction Type": order.transactionType,
        "Total Amount": order.lineItems.reduce((sum: number, item: any) => sum + item.amount, 0),
        Status: order.status,
      }));

      const ws = utils.json_to_sheet(formattedSalesOrders);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Sales Orders");

      writeFile(wb, "SalesOrders.xlsx");

      message.success("Sales Orders exported to Excel!");
    } catch (err) {
      console.error(err);
      message.error("Failed to export Sales Orders.");
    }
  };

  const handleViewList = () => {
    setView("list");
  };

  const handleViewForm = () => {
    setView("form");
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 24, background: "#fff", flex: 1 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<PlusOutlined />}
            onClick={handleViewForm}
            type={view === "form" ? "primary" : "default"}
          >
            New
          </Button>
          <Button
            icon={<FileTextOutlined />}
            onClick={handleViewList}
            type={view === "list" ? "primary" : "default"}
          >
            List
          </Button>
          <Button icon={<ExportOutlined />} onClick={handleExport}>
            Export to Excel
          </Button>
        </Space>

        <Divider />

        {view === "form" ? (
          <SalesOrderForm />
        ) : (
          <SalesOrderList />
        )}
      </div>
    </Layout>
  );
};

export default SalesOrderPage;
