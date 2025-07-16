-- CreateTable
CREATE TABLE `Customer` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `type` ENUM('AccountsPayable', 'AccountsReceivable', 'AccumulatedDepreciation', 'CashAtBank', 'CashOnHand', 'CostOfSales', 'EquityDoesNotClose', 'EquityGetsClosed', 'EquityRetainedEarnings', 'Expenses', 'FixedAssets', 'Income', 'Inventory', 'LongTermLiabilities', 'OtherAssets', 'OtherCurrentAssets', 'OtherCurrentLiabilities', 'OtherIncome') NOT NULL,
    `inactive` BOOLEAN NOT NULL DEFAULT false,
    `isAR` BOOLEAN NOT NULL DEFAULT false,
    `isGL` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Account_accountNumber_key`(`accountNumber`),
    INDEX `Account_isAR_isGL_idx`(`isAR`, `isGL`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryItem` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `InventoryItem_sku_key`(`sku`),
    INDEX `InventoryItem_sku_idx`(`sku`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrder` (
    `id` VARCHAR(191) NOT NULL,
    `soNumber` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `oneTimeCustomerName` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerPO` VARCHAR(191) NULL,
    `arAccountId` VARCHAR(191) NOT NULL,
    `shipBy` DATETIME(3) NULL,
    `transactionType` ENUM('GOODS', 'SERVICES') NOT NULL,
    `transactionOrigin` ENUM('LOCAL', 'IMPORTED') NULL,
    `shipVia` ENUM('CUSTOMER_VEHICLE', 'COMPANY_VEHICLE') NULL,
    `status` ENUM('DRAFT', 'SUBMITTED') NOT NULL DEFAULT 'DRAFT',
    `totalAmount` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SalesOrder_customerId_arAccountId_status_idx`(`customerId`, `arAccountId`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SalesOrderLineItem` (
    `id` VARCHAR(191) NOT NULL,
    `salesOrderId` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `shipped` INTEGER NOT NULL DEFAULT 0,
    `inventoryItemId` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `glAccountId` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191) NULL,
    `project` VARCHAR(191) NULL,
    `phase` VARCHAR(191) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,

    INDEX `SalesOrderLineItem_salesOrderId_glAccountId_inventoryItemId_idx`(`salesOrderId`, `glAccountId`, `inventoryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tax` (
    `id` VARCHAR(191) NOT NULL,
    `taxType` VARCHAR(191) NOT NULL,
    `rate` DECIMAL(5, 2) NOT NULL,
    `taxAuthorityName` VARCHAR(191) NULL,
    `vendorOrCustomer` ENUM('VENDOR', 'CUSTOMER') NOT NULL,
    `vendorTaxOffice` VARCHAR(191) NULL,
    `glAccountId` VARCHAR(191) NOT NULL,

    INDEX `Tax_taxType_glAccountId_idx`(`taxType`, `glAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrder` ADD CONSTRAINT `SalesOrder_arAccountId_fkey` FOREIGN KEY (`arAccountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderLineItem` ADD CONSTRAINT `SalesOrderLineItem_salesOrderId_fkey` FOREIGN KEY (`salesOrderId`) REFERENCES `SalesOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderLineItem` ADD CONSTRAINT `SalesOrderLineItem_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `InventoryItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderLineItem` ADD CONSTRAINT `SalesOrderLineItem_glAccountId_fkey` FOREIGN KEY (`glAccountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SalesOrderLineItem` ADD CONSTRAINT `SalesOrderLineItem_taxId_fkey` FOREIGN KEY (`taxId`) REFERENCES `Tax`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tax` ADD CONSTRAINT `Tax_glAccountId_fkey` FOREIGN KEY (`glAccountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
