import React, { useState } from "react";
import { Modal, Form, Input, Select, Switch, message } from "antd";
import { createAccount } from "../api/salesOrderApi";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddAccountModal: React.FC<Props> = ({ visible, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        accountNumber: values.accountNumber,
        title: values.title,
        type: values.type,
        inactive: values.inactive ?? false,
        isAR: values.isAR ?? false,
        isGL: values.isGL ?? false,
      };

      setLoading(true);
      await createAccount(payload);

      message.success("Account created successfully!");
      form.resetFields();
      onClose();
      onCreated();
    } catch (err) {
      console.error(err);
      message.error("Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Account"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Create"
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Account Number"
          name="accountNumber"
          rules={[{ required: true, message: "Please enter account number" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Account Name"
          name="title"
          rules={[{ required: true, message: "Please enter account name" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Account Type"
          name="type"
          rules={[{ required: true, message: "Please select account type" }]}
        >
          <Select placeholder="Select account type" disabled={loading}>
            <Option value="AccountsPayable">Accounts Payable</Option>
            <Option value="AccountsReceivable">Accounts Receivable</Option>
            <Option value="AccumulatedDepreciation">Accumulated Depreciation</Option>
            <Option value="CashAtBank">Cash At Bank</Option>
            <Option value="CashOnHand">Cash On Hand</Option>
            <Option value="CostOfSales">Cost Of Sales</Option>
            <Option value="EquityDoesNotClose">Equity (Does Not Close)</Option>
            <Option value="EquityGetsClosed">Equity (Gets Closed)</Option>
            <Option value="EquityRetainedEarnings">Equity Retained Earnings</Option>
            <Option value="Expenses">Expenses</Option>
            <Option value="FixedAssets">Fixed Assets</Option>
            <Option value="Income">Income</Option>
            <Option value="Inventory">Inventory</Option>
            <Option value="LongTermLiabilities">Long Term Liabilities</Option>
            <Option value="OtherAssets">Other Assets</Option>
            <Option value="OtherCurrentAssets">Other Current Assets</Option>
            <Option value="OtherCurrentLiabilities">Other Current Liabilities</Option>
            <Option value="OtherIncome">Other Income</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Inactive" name="inactive" valuePropName="checked">
          <Switch disabled={loading} />
        </Form.Item>
        <Form.Item label="Use as Accounts Receivable" name="isAR" valuePropName="checked">
          <Switch disabled={loading} />
        </Form.Item>
        <Form.Item label="Use as GL Account" name="isGL" valuePropName="checked">
          <Switch disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;
