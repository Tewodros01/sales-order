# Sales Order Module

## 🔵 Feature Specification

### 🔹 Navigation
**Path:** `/sales-orders`

**Actions Available:**
- New
- List
- Save
- Save & New
- Delete

---

### 🔹 Header Fields

| Field Name          | Type        | Required | Description                                                      |
|---------------------|-------------|----------|------------------------------------------------------------------|
| Customer            | Dropdown    | ✅        | Select existing customer                                          |
| One Time Customer Name | Text      | ❌        | Optional for ad hoc customers                                    |
| Date                | Date picker | ✅        | Default to current date                                          |
| SO No               | Auto-generated | ✅     | Unique Sales Order Number                                        |
| Customer PO         | Text        | ❌        | Customer’s reference number                                      |
| AR Account          | Dropdown/Search | ✅     | Linked Accounts Receivable account                                |
| Ship By             | Date picker | ❌        | Desired shipping date                                            |
| Transaction Type    | Dropdown    | ✅        | "Goods" or "Services"                                            |
| Transaction Origin  | Dropdown    | ❌        | Local/Imported                                                   |
| Ship Via            | Dropdown    | ❌        | Customer’s Vehicle/Company Vehicle                               |

---

### 🔹 Line Items Section

| Field       | Description                                              |
|-------------|----------------------------------------------------------|
| Quantity    | Editable field                                           |
| Item        | Searchable dropdown from inventory                        |
| Description | Auto-filled or editable                                   |
| Unit Price  | Editable                                                  |
| GL Account  | Linked to item/account                                    |
| Amount      | Auto-calculated (Qty × Price)                              |

- ✅ **User Requirement:** User should be allowed to save more than one item, but at least one item must be added to save.

---

### 🟢 General Functional Requirements

- All data should be validated before saving (required fields, valid account mappings).
- Records should be saved in **draft status** unless explicitly submitted.
- **Line totals** must recalculate dynamically on quantity, unit price.

---

### Common Layout Template for List Pages

#### ✅ Header Buttons (Top Left):
- **+ New** – Opens the form to create a new record.
- **Export Excel** – Downloads the list in Excel format.

#### ✅ Search & Filter Bar:
- **Search Field** – Search by key fields like number, name, ID.
- **Date Range Picker** – Filter by document date (e.g., PO Date / SO Date).
