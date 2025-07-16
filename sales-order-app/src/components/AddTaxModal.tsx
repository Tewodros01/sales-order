import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, message } from "antd";
import { createTax, getAccounts } from "../api/salesOrderApi";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddTaxModal: React.FC<Props> = ({ visible, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchAccounts();
  }, [visible]);

  const fetchAccounts = async () => {
    setAccountsLoading(true);
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load accounts.");
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        taxType: values.taxType,
        rate: values.rate,
        taxAuthorityName: values.taxAuthorityName || undefined,
        bankAccountNumber: values.bankAccountNumber || undefined,
        vendorOrCustomer: values.vendorOrCustomer,
        vendorTaxOffice: values.vendorTaxOffice || undefined,
        glAccountId: values.glAccountId,
      };

      setLoading(true);
      await createTax(payload);

      message.success("Tax created successfully!");
      form.resetFields();
      onClose();
      onCreated();
    } catch (err) {
      console.error(err);
      message.error("Failed to create tax.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Tax"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Tax Type"
          name="taxType"
          rules={[{ required: true, message: "Please enter tax type" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Rate (%)"
          name="rate"
          rules={[{ required: true, message: "Please enter rate" }]}
        >
          <InputNumber
            min={0}
            max={100}
            precision={2}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Tax Authority Name"
          name="taxAuthorityName"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Bank Account Number"
          name="bankAccountNumber"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Vendor or Customer"
          name="vendorOrCustomer"
          rules={[{ required: true, message: "Please select party" }]}
        >
          <Select placeholder="Select party">
            <Option value="VENDOR">Vendor</Option>
            <Option value="CUSTOMER">Customer</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Vendor Tax Office"
          name="vendorTaxOffice"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="GL Account"
          name="glAccountId"
          rules={[{ required: true, message: "Please select GL account" }]}
        >
          <Select
            placeholder="Select GL Account"
            loading={accountsLoading}
          >
            {accounts.map((acc) => (
              <Option key={acc.id} value={acc.id}>
                {acc.accountNumber} - {acc.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTaxModal;
