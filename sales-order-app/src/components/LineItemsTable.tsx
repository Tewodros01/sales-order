import React, { useEffect, useState } from "react";
import {
  Table,
  InputNumber,
  Input,
  Select,
  Button,
  Form,
  Spin,
  Divider,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getInventoryItems,
  getTaxes,
  getAccounts,
} from "../api/salesOrderApi";
import AddInventoryItemModal from "./AddInventoryItemModal";
import AddTaxModal from "./AddTaxModal";
import AddAccountModal from "./AddAccountModal";
import type { LineItem } from "../types/LineItem";
import type { TransactionType } from "../types/enums";

const { Option } = Select;

interface Props {
  transactionType: TransactionType;
  items: LineItem[];
  onAdd: () => void;
  onChange: (key: string, field: keyof LineItem, value: any) => void;
  onDelete: (key: string) => void;
}

const LineItemsTable: React.FC<Props> = ({
  transactionType,
  items,
  onAdd,
  onChange,
  onDelete,
}) => {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [taxes, setTaxes] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState(false);
  const [isAddTaxModalVisible, setIsAddTaxModalVisible] = useState(false);
  const [isAddAccountModalVisible, setIsAddAccountModalVisible] = useState(false);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    setLoading(true);
    try {
      const [invRes, taxRes, accRes] = await Promise.all([
        getInventoryItems(),
        getTaxes(),
        getAccounts(),
      ]);
      setInventoryItems(invRes.data);
      setTaxes(taxRes.data);
      setAccounts(accRes.data.filter((a: { isGL: any }) => a.isGL));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate amount including tax
  const calculateAmount = (quantity: number, unitPrice: number, taxRate: number) => {
    const lineAmount = quantity * unitPrice;
    const taxAmount = lineAmount * (taxRate / 100);
    return lineAmount + taxAmount;
  };

  // Function to get the tax rate from the taxes array
  const getTaxRate = (taxId: string | undefined) => {
    const tax = taxes.find((tax) => tax.id === taxId);
    return tax ? tax.rate : 0;
  };

  const validateTax = (taxId?: string) =>
    !taxId
      ? { validateStatus: "error" as const, help: "Please select tax" }
      : {};

  const baseColumns = [
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (_: unknown, record: LineItem) => (
        <InputNumber
          min={0}
          value={record.quantity}
          onChange={(v) => onChange(record.key, "quantity", v)}
        />
      ),
    },
    {
      title: "Shipped",
      dataIndex: "shipped",
      render: (_: unknown, record: LineItem) => (
        <InputNumber
          min={0}
          value={record.shipped}
          onChange={(v) => onChange(record.key, "shipped", v)}
        />
      ),
    },
    {
      title: "Item",
      dataIndex: "inventoryItemId",
      render: (_: unknown, record: LineItem) => (
        <Select
          placeholder="Select Item"
          value={record.inventoryItemId || undefined}
          style={{ width: 200 }}
          onChange={(v) => onChange(record.key, "inventoryItemId", v)}
          loading={loading}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Button
                type="link"
                onClick={() => setIsAddItemModalVisible(true)}
                style={{ padding: "0 12px" }}
              >
                + Add Item
              </Button>
            </>
          )}
        >
          {inventoryItems.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: unknown, record: LineItem) => (
        <Input
          value={record.description}
          onChange={(e) =>
            onChange(record.key, "description", e.target.value)
          }
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (_: unknown, record: LineItem) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          onChange={(v) => onChange(record.key, "unitPrice", v)}
        />
      ),
    },
    {
      title: "GL Account",
      dataIndex: "glAccountId",
      render: (_: unknown, record: LineItem) => (
        <Select
          placeholder="Select GL Account"
          value={record.glAccountId || undefined}
          style={{ width: 200 }}
          onChange={(v) => onChange(record.key, "glAccountId", v)}
          loading={loading}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Button
                type="link"
                onClick={() => setIsAddAccountModalVisible(true)}
                style={{ padding: "0 12px" }}
              >
                + Add GL Account
              </Button>
            </>
          )}
        >
          {accounts.map((acc) => (
            <Option key={acc.id} value={acc.id}>
              {acc.title} ({acc.accountNumber})
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (_: unknown, record: LineItem) => (
        <Input
          value={record.project}
          onChange={(e) =>
            onChange(record.key, "project", e.target.value)
          }
        />
      ),
    },
    {
      title: "Phase",
      dataIndex: "phase",
      render: (_: unknown, record: LineItem) => (
        <Input
          value={record.phase}
          onChange={(e) =>
            onChange(record.key, "phase", e.target.value)
          }
        />
      ),
    },
    {
      title: "Tax",
      dataIndex: "taxId",
      render: (_: unknown, record: LineItem) => (
        <Form.Item {...validateTax(record.taxId)} style={{ margin: 0 }} >
          <Select
            placeholder="Select Tax"
            value={record.taxId || undefined}
            style={{ width: 200 }}
            onChange={(v) => onChange(record.key, "taxId", v)}
            loading={loading}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Button
                  type="link"
                  onClick={() => setIsAddTaxModalVisible(true)}
                  style={{ padding: "0 12px" }}
                >
                  + Add Tax
                </Button>
              </>
            )}
          >
            {taxes.map((tax) => (
              <Option key={tax.id} value={tax.id}>
                {tax.taxType} ({tax.rate}%)
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_: unknown, record: LineItem) => {
        const taxRate = getTaxRate(record.taxId);
        const lineAmount = calculateAmount(record.quantity, record.unitPrice, taxRate);
        return <span>{lineAmount.toFixed(2)}</span>;
      },
    },
    {
      title: "",
      dataIndex: "action",
      render: (_: unknown, record: LineItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(record.key)}
        />
      ),
    },
  ];

  const columns =
    transactionType === "SERVICES"
      ? baseColumns.filter((col) => col.title !== "Item")
      : baseColumns;

  return (
    <div>
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Spin />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey="key"
          scroll={{ x: "max-content" }}
          summary={() => {
            const totalAmount = items.reduce((sum, row) => {
              const taxRate = row.taxId
                ? taxes.find((tax) => tax.id === row.taxId)?.rate || 0
                : 0;
              return sum + calculateAmount(row.quantity, row.unitPrice, taxRate);
            }, 0);

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell
                  index={0}
                  colSpan={columns.length - 2}
                  align="right"
                >
                  Total:
                </Table.Summary.Cell>
                <Table.Summary.Cell index={columns.length - 2}>
                  {totalAmount.toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      )}
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <Button type="dashed" onClick={onAdd} icon={<PlusOutlined />}>
          Add Item
        </Button>
      </div>
      <AddInventoryItemModal
        visible={isAddItemModalVisible}
        onClose={() => setIsAddItemModalVisible(false)}
        onCreated={() => {
          fetchDropdownData();
          setIsAddItemModalVisible(false);
        }}
      />
      <AddTaxModal
        visible={isAddTaxModalVisible}
        onClose={() => setIsAddTaxModalVisible(false)}
        onCreated={() => {
          fetchDropdownData();
          setIsAddTaxModalVisible(false);
        }}
      />
      <AddAccountModal
        visible={isAddAccountModalVisible}
        onClose={() => setIsAddAccountModalVisible(false)}
        onCreated={() => {
          fetchDropdownData();
          setIsAddAccountModalVisible(false);
        }}
      />
    </div>
  );
};

export default LineItemsTable;
