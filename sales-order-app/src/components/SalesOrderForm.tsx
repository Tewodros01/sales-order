import { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Row,
  Col,
  Divider,
  message,
  Spin,
} from "antd";
import moment from "moment";
import AddCustomerModal from "./AddCustomerModal";
import AddAccountModal from "./AddAccountModal";
import LineItemsTable from "./LineItemsTable";
import {
  createSalesOrder,
  getCustomers,
  getAccounts,
} from "../api/salesOrderApi";
import { SaveOutlined } from "@ant-design/icons";
import type { LineItem } from "../types/LineItem";
import type { TransactionType, TransactionOrigin, ShipVia } from "../types/enums";
import type { SalesOrderPayload } from "../types/SalesOrderPayload";

const { Option } = Select;

const SalesOrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<LineItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [transactionType, setTransactionType] = useState<TransactionType>("GOODS");
  const [isCustomerModalVisible, setIsCustomerModalVisible] = useState(false);
  const [isAccountModalVisible, setIsAccountModalVisible] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [soNumber, setSoNumber] = useState<string>("");

  const generateSoNumber = () => {
    const uniqueNumber = `SO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setSoNumber(uniqueNumber);
  };

  useEffect(() => {
    fetchData();
    generateSoNumber();
  }, []);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [custRes, accRes] = await Promise.all([getCustomers(), getAccounts()]);
      setCustomers(custRes.data);
      setAccounts(accRes.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load dropdown data.");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (status: "DRAFT" | "SUBMITTED") => {
    try {
      const values = await form.validateFields();

      if (transactionType === "GOODS" && items.length === 0) {
        message.error("Please add at least one line item for goods.");
        return;
      }

      // Prepare line items with conditional logic for "GOODS" and "SERVICES"
      const lineItems = items.map((item) => ({
        inventoryItemId: transactionType === "SERVICES" ? "" : item.inventoryItemId,
        glAccountId: item.glAccountId,
        taxId: item.taxId,
        quantity: item.quantity,
        shipped: item.shipped,
        description: item.description,
        unitPrice: item.unitPrice,
        project: item.project,
        phase: item.phase,
      }));

      const payload: SalesOrderPayload = {
        soNumber,
        customerId: values.customer !== "oneTime" ? values.customer : undefined,
        oneTimeCustomerName: values.customer === "oneTime" ? values.oneTimeCustomerName : undefined,
        date: values.date?.toISOString(),
        customerPO: values.customerPO,
        arAccountId: values.arAccount,
        shipBy: values.shipBy?.toISOString(),
        transactionType,
        transactionOrigin: values.transactionOrigin as TransactionOrigin,
        shipVia: values.shipVia as ShipVia,
        lineItems,
        status,
      };

      setLoading(true);

      // Submit the sales order
      await createSalesOrder(payload);

      message.success(`Sales Order ${status === "DRAFT" ? "saved as draft" : "SUBMITTED"}!`);

      form.resetFields();
      setItems([]);
      setTransactionType("GOODS");
      setOrderId(null);
    } catch (err) {
      console.error(err);
      message.error("Error saving Sales Order.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: Date.now().toString(),
        quantity: 0,
        shipped: 0,
        inventoryItemId: "",
        description: "",
        unitPrice: 0,
        glAccountId: "",
        project: "",
        phase: "",
        taxId: undefined,
      },
    ]);
  };

  const handleItemChange = (key: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((row) => (row.key === key ? { ...row, [field]: value } : row))
    );
  };

  const handleDeleteItem = (key: string) => {
    setItems((prev) => prev.filter((row) => row.key !== key));
  };

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      {fetching ? (
        <Spin />
      ) : (
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            date: moment(),
            transactionType: "GOODS",
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="customer"
                label="Customer"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select customer"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => setIsCustomerModalVisible(true)}
                      >
                        + Add Customer
                      </Button>
                    </>
                  )}
                >
                  {customers.map((c) => (
                    <Option key={c.id} value={c.id}>
                      {c.name}
                    </Option>
                  ))}
                  <Option value="oneTime">One Time Customer</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="oneTimeCustomerName" label="One Time Customer Name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="soNumber" label="SO No" initialValue={soNumber}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="customerPO" label="Customer PO">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={4}>
              <Form.Item
                name="arAccount"
                label="AR Account"
                rules={[{ required: true, message: "Please select an AR account" }]}
              >
                <Select
                  placeholder="Select AR Account"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Button
                        type="link"
                        onClick={() => setIsAccountModalVisible(true)}
                        style={{ padding: "0 12px" }}
                      >
                        + Add Account
                      </Button>
                    </>
                  )}
                >
                  {accounts
                    .filter((account) => account.isAR)
                    .map((a) => (
                      <Option key={a.id} value={a.id}>
                        {a.title}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="shipBy" label="Ship By">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                name="transactionType"
                label="Transaction Type"
                rules={[{ required: true }]}
              >
                <Select
                  onChange={(value) =>
                    setTransactionType(value as TransactionType)
                  }
                >
                  <Option value="GOODS">Goods</Option>
                  <Option value="SERVICES">Services</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="transactionOrigin" label="Transaction Origin">
                <Select>
                  <Option value="LOCAL">Local</Option>
                  <Option value="IMPORTED">Imported</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="shipVia" label="Ship Via">
                <Select>
                  <Option value="CUSTOMER_VEHICLE">Customer Vehicle</Option>
                  <Option value="COMPANY_VEHICLE">Company Vehicle</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
      <Divider />
      <LineItemsTable
        transactionType={transactionType}
        items={items}
        onAdd={handleAddItem}
        onChange={handleItemChange}
        onDelete={handleDeleteItem}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          icon={<SaveOutlined />}
          onClick={() => handleSave("DRAFT")}
          loading={loading}
        >
          Save as Draft
        </Button>
        <Button
          icon={<SaveOutlined />}
          onClick={() => handleSave("SUBMITTED")}
          loading={loading}
          style={{ marginLeft: "10px" }}
        >
          Save as Submit
        </Button>
      </div>

      <AddCustomerModal
        visible={isCustomerModalVisible}
        onClose={() => setIsCustomerModalVisible(false)}
        onCreated={fetchData}
      />
      <AddAccountModal
        visible={isAccountModalVisible}
        onClose={() => setIsAccountModalVisible(false)}
        onCreated={fetchData}
      />
    </div>
  );
};

export default SalesOrderForm;
