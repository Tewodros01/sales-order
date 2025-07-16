import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { AccountModule } from './account/account.module';
import { InventoryItemModule } from './inventory-item/inventory-item.module';
import { TaxModule } from './tax/tax.module';
import { SalesOrderModule } from './sales-order/sales-order.module';

@Module({
  imports: [PrismaModule, CustomerModule, AccountModule, InventoryItemModule, TaxModule, SalesOrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
