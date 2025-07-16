import React, { useState, useEffect } from "react";
import { Table, Spin, Button, Input, DatePicker, Select, Space, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchSalesOrders, removeSalesOrder } from "../stores/salesOrderSlice";
import type { SalesOrder, Customer, Account } from "../types";
import type { AppDispatch, RootState } from "../stores/store";
import { getAccounts } from "../api/salesOrderApi";
import { type Moment } from "moment";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SalesOrderList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { salesOrders, loading } = useSelector((state: RootState) => state.salesOrder);
  const [arAccounts, setArAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dateRange, setDateRange] = useState<[Moment, Moment] | null>(null);
  const [transactionType, setTransactionType] = useState<string | undefined>(undefined);
  const [arAccountId, setArAccountId] = useState<string | undefined>(undefined); // Use arAccountId now
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchSalesOrders({
      search: searchTerm,
      dateFrom: dateRange ? dateRange[0].toISOString() : undefined,
      dateTo: dateRange ? dateRange[1].toISOString() : undefined,
      transactionType,
      arAccountId,
    }));
  }, [dispatch, searchTerm, dateRange, transactionType, arAccountId]);

  useEffect(() => {
    const fetchArAccounts = async () => {
      try {
        const response = await getAccounts();
        setArAccounts(response.data);
      } catch (error) {
        message.error("Error fetching AR accounts");
        console.error("Error fetching AR accounts:", error);
      }
    };
    fetchArAccounts();
  }, []);

  const handleDeleteOrder = async () => {
    if (orderIdToDelete) {
      setDeleting(true);
      try {
        await dispatch(removeSalesOrder(orderIdToDelete));
        message.success("Order deleted successfully!");
        setConfirmDeleteModalVisible(false);
      } catch (error) {
        message.error("Failed to delete the order");
      } finally {
        setDeleting(false);
      }
    }
  };

  const columns = [
    {
      title: "SO No",
      dataIndex: "soNumber",
      key: "soNumber",
      render: (soNumber: string) => soNumber || "",
    },
    {
      title: "Customer Name",
      dataIndex: "customer",
      key: "customer",
      render: (customer: Customer) => customer?.name || "",
    },
    {
      title: "Customer Email",
      dataIndex: "customer",
      key: "customerEmail",
      render: (customer: Customer) => customer?.email || "No Email",
    },
    {
      title: "AR Account",
      dataIndex: "arAccount",
      key: "arAccount",
      render: (arAccount: Account) => arAccount?.title || "No Account",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type: "GOODS" | "SERVICES") => type || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span style={{ color: status === "SUBMITTED" ? "green" : "orange" }}>
          {status}
        </span>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: string | number) => {
        const numericAmount = Number(amount);
        return `$${numericAmount.toFixed(2)}`;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: SalesOrder) => (
        <Button
          type="link"
          onClick={() => {
            setOrderIdToDelete(record.id);
            setConfirmDeleteModalVisible(true);
          }}
          style={{ color: "red" }}
          loading={deleting}
        >
          <DeleteOutlined />
        </Button>
      ),
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateRangeChange = (dates: [Moment, Moment] | null) => {
    setDateRange(dates);
  };

  const handleTransactionTypeChange = (value: string) => {
    setTransactionType(value);
  };

  const handleArAccountChange = (value: string) => {
    setArAccountId(value);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Input
            placeholder="Search by SO Number, Customer Name, or Customer PO"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: 300 }}
          />
          <RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
          <Select
            placeholder="Select Transaction Type"
            onChange={handleTransactionTypeChange}
            style={{ width: 200 }}
          >
            <Option value="GOODS">Goods</Option>
            <Option value="SERVICES">Services</Option>
          </Select>
          <Select
            placeholder="Select AR Account"
            onChange={handleArAccountChange}
            style={{ width: 200 }}
          >
            {arAccounts.map((account) => (
              <Option key={account.id} value={account.id}> {/* Use AR Account ID instead of title */}
                {account.title}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          columns={columns}
          dataSource={salesOrders} // Use filtered orders directly
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      )}

      <Modal
        title="Confirm Deletion"
        open={confirmDeleteModalVisible}
        onOk={handleDeleteOrder}
        onCancel={() => setConfirmDeleteModalVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this order?</p>
      </Modal>
    </div>
  );
};

export default SalesOrderList;
