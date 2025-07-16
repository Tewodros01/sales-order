import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { createCustomer } from "../api/salesOrderApi";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddCustomerModal: React.FC<Props> = ({ visible, onClose, onCreated }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.customerName,
        email: values.email || undefined,
      };

      setLoading(true);
      await createCustomer(payload);

      message.success("Customer created successfully!");
      form.resetFields();
      onClose();
      onCreated();
    } catch (err) {
      console.error(err);
      message.error("Failed to create customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Customer"
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
          label="Customer Name"
          name="customerName"
          rules={[{ required: true, message: "Please enter customer name" }]}
        >
          <Input disabled={loading} />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input disabled={loading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;
