import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Order } from 'src/app/models/products';
import { ordersToOrderItems } from 'src/app/models/transaction/order_items';
import {
  Payment,
  PaymentDetails,
  PaymentStatus,
  PaymentType,
} from 'src/app/models/transaction/payment';
import { TrasactionDetails } from 'src/app/models/transaction/transaction_details';
import { TransactionStatus } from 'src/app/models/transaction/transaction_status';
import { TransactionType } from 'src/app/models/transaction/transaction_type';
import { Transactions } from 'src/app/models/transaction/transactions';
import { Users } from 'src/app/models/users';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { computeSubTotal, formatPrice } from 'src/app/utils/constants';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
})
export class AddPaymentComponent implements OnInit {
  users: Users | null = null;
  @Input() transaction: Transactions | null = null;
  @Output() confirmOrder = new EventEmitter<Payment>();
  cashReceived: number = 0;
  constructor(
    public loadingService: LoadingService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((value) => {
      if (value !== null) {
        this.getUserInfo(value.uid);
      }
    });
  }

  getUserInfo(uid: string) {
    this.authService.getUserAccount(uid).then((value) => {
      console.log(value);
      if (value.exists()) {
        const users: Users = value.data();
        this.users = users;
        this.cdr.detectChanges();
      }
    });
  }
  submit(cash: number) {
    let details: PaymentDetails = {
      confirmedBy: this.users?.name ?? '',
      cashReceive: cash,
      reference: '',
      attachmentURL: '',
      createdAt: Timestamp.now(),
    };
    this.transaction!.payment.status = PaymentStatus.PAID;
    this.transaction!.payment.details = details;
    if (this.users !== null) {
      this.confirmOrder.emit(this.transaction!.payment);
    }
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
