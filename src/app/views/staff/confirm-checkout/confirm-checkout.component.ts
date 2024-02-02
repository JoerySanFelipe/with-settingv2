import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Toast } from 'bootstrap';
import { Order } from 'src/app/models/products';
import {
  OrderItems,
  ordersToOrderItems,
} from 'src/app/models/transaction/order_items';
import {
  PaymentDetails,
  PaymentStatus,
  PaymentType,
} from 'src/app/models/transaction/payment';
import { TrasactionDetails } from 'src/app/models/transaction/transaction_details';
import { TransactionStatus } from 'src/app/models/transaction/transaction_status';
import { TransactionType } from 'src/app/models/transaction/transaction_type';

import { Transactions } from 'src/app/models/transaction/transactions';
import { Users } from 'src/app/models/users';
import { LoadingService } from 'src/app/services/loading.service';
import { computeSubTotal, formatPrice } from 'src/app/utils/constants';

@Component({
  selector: 'app-confirm-checkout',
  templateUrl: './confirm-checkout.component.html',
  styleUrls: ['./confirm-checkout.component.css'],
})
export class ConfirmCheckoutComponent {
  @Input() users: Users | null = null;
  @Input() orders: Order[] = [];
  @Output() confirmOrder = new EventEmitter<Transactions>();
  cashReceived: number = 0;
  constructor(public loadingService: LoadingService) {}
  submit(cash: number) {
    if (this.isAmountValid()) {
      let items = ordersToOrderItems(this.orders);
      let details: TrasactionDetails = {
        updatedBy: '',
        message: `Cashier : ${
          this.users?.name ?? ''
        }  received :  ${this.formatNumber(
          cash
        )} total order value : ${this.formatNumber(
          this.subtotal(this.orders)
        )}`,
        status: TransactionStatus.COMPLETED,
        updatedAt: Timestamp.now(),
      };
      let paymentDetails: PaymentDetails = {
        confirmedBy: this.users?.name ?? '',
        reference: '',
        attachmentURL: '',
        createdAt: Timestamp.now(),
        cashReceive: cash,
      };
      let transaction: Transactions = {
        id: '',
        customerID: '',
        cashierID: this.users?.id ?? '',
        type: TransactionType.WALK_IN,
        orderList: items,
        message: '',
        status: TransactionStatus.COMPLETED,
        payment: {
          amount: this.subtotal(this.orders),
          type: PaymentType.PAY_IN_COUNTER,
          status: PaymentStatus.PAID,
          details: paymentDetails,
        },
        details: [details],
        createdAt: Timestamp.now(),
      };
      this.confirmOrder.emit(transaction);
    } else {
      // Show an error message or handle the case where the amount is insufficient
    }
  }

  isAmountValid(): boolean {
    const totalAmount = this.subtotal(this.orders);
    return this.cashReceived >= totalAmount;
  }

  subtotal(orders: Order[]): number {
    return computeSubTotal(orders);
  }
  formatNumber(num: number): string {
    return formatPrice(num);
  }

  onCashReceivedChange(num: number) {
    this.cashReceived = num;
  }
  computeChange(total: number, cashReceived: number): number {
    if (total >= cashReceived) {
      return 0;
    }
    return cashReceived - total;
  }

  isCashReceivedNaN(): boolean {
    return isNaN(this.cashReceived);
  }
}
