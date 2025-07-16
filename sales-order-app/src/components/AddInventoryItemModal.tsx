import React, { useState } from "react";
import { Modal, Form, Input, InputNumber, message } from "antd";
import { createInventoryItem } from "../api/salesOrderApi";

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const AddInventoryItemModal: React.FC<Props> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        sku: values.sku,
        name: values.name,
        description: values.description,
        unitPrice: values.unitPrice,
      };

      setLoading(true);
      await createInventoryItem(payload);

      message.success("Inventory item created successfully!");
      form.resetFields();
      onClose();
      onCreated();
    } catch (err) {
      console.error(err);
      message.error("Failed to create inventory item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Inventory Item"
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
          label="SKU"
          name="sku"
          rules={[{ required: true, message: "Please enter SKU" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          label="Unit Price"
          name="unitPrice"
          rules={[{ required: true, message: "Please enter unit price" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddInventoryItemModal;
