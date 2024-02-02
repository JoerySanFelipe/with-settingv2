import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Timestamp, Transaction, or } from '@angular/fire/firestore';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ActionType, ComponentType } from 'src/app/models/audit/audit_type';
import { Order, Products, productToOrder } from 'src/app/models/products';
import { PaymentStatus, PaymentType } from 'src/app/models/transaction/payment';
import { TransactionStatus } from 'src/app/models/transaction/transaction_status';
import { TransactionType } from 'src/app/models/transaction/transaction_type';
import { Transactions } from 'src/app/models/transaction/transactions';
import { UserType } from 'src/app/models/user-type';
import { Users } from 'src/app/models/users';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import {
  computeSubTotal,
  formatPrice,
  getEffectivePrice,
} from 'src/app/utils/constants';

declare var window: any;
@Component({
  selector: 'app-staff-home',
  templateUrl: './staff-home.component.html',
  styleUrls: ['./staff-home.component.css'],
})
export class StaffHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  checkoutModal: any;
  _subscription: Subscription;
  _products: Products[] = [];
  _categories: string[] = [];
  _productItems: Order[] = [];
  activeTab = 0;
  _cart: Order[] = [];
  _users: Users | null = null;
  selectTab(index: number) {
    this.activeTab = index;
  }
  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private toastr: ToastrService,
    public loadingService: LoadingService,
    private transactionService: TransactionsService,
    private auditService: AuditLogService
  ) {
    this._subscription = new Subscription();
  }

  ngOnInit(): void {
    this.checkoutModal = new window.bootstrap.Modal(
      document.getElementById('checkoutModal')
    );
    this._subscription = this.productService
      .getAllProducts()
      .subscribe((data: Products[]) => {
        this._products = data;
        this._products.map((product) => {
          this._productItems.push(...productToOrder(product));
        });
        this._categories = data.map((e) => e.category.toLowerCase());
        const uniqueCategoriesSet = new Set();
        this._categories = this._categories.filter((category) => {
          if (!uniqueCategoriesSet.has(category)) {
            uniqueCategoriesSet.add(category);
            return true;
          }
          return false;
        });
      });
    this.authService.getCurrentUser().subscribe((value) => {
      if (value != null) {
        this.getUserInfo(value.uid);
      }
    });
  }

  filterProductsPercategory(category: string): Order[] {
    return this._productItems.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  ngAfterViewInit(): void {
    const element = document.getElementById('productTabs');
    if (element) {
      new bootstrap.Tab(element).show();
    }
  }

  ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  formatPrice(num: number): string {
    return formatPrice(num);
  }
  addOrder(order: Order) {
    if (!this._cart.includes(order)) {
      this._cart.unshift(order);
    }
  }

  increaseQuantity(index: number, order: Order) {
    if (order.stocks > order.quantity) {
      this._cart[index].quantity += 1;
    }
  }
  decreaseQuantity(index: number) {
    let order = this._cart[index];
    if (order.quantity < 2) {
      this._cart.splice(index, 1);
    } else {
      this._cart[index].quantity -= 1;
    }
  }
  subtotal(orders: Order[]): string {
    return formatPrice(computeSubTotal(orders));
  }

  getUserInfo(uid: string) {
    this.authService.getUserAccount(uid).then((value) => {
      console.log(value);
      if (value.exists()) {
        const users: Users = value.data();
        this._users = users;
      }
    });
  }
  openModal() {
    if (this._cart.length === 0) {
      this.toastr.warning(
        'Please add product to checkout',
        'No product in cart'
      );
      return;
    }
    if (this._users === null) {
      this.toastr.error('No cashier logged in!', 'Invalid Transaction');
      return;
    }
    this.checkoutModal.show();
  }
  closeModal() {
    this.checkoutModal.hide();
  }

  confirmOrder(transaction: Transactions) {
    this.loadingService.showLoading('checkout');
    this.transactionService
      .createTransaction(transaction)
      .then(async (task) => {
        await this.productService.batchUpdateProductQuantity(
          transaction.orderList
        );

        await this.auditService.saveAudit({
          id: '',
          email: this._users?.email ?? '',
          role: UserType.STAFF,
          action: ActionType.CREATE,
          component: ComponentType.TRANSACTION,
          payload: transaction,
          details: 'adding transaction',
          timestamp: Timestamp.now(),
        });

        this._productItems = [];
        this.toastr.success('transasction success');
      })
      .catch((err) => this.toastr.error(err.message))
      .finally(() => {
        this.loadingService.hideLoading('checkout');
        this.closeModal();
        this._cart = [];
      });
  }

  encodedUser() {
    return JSON.stringify(this._users);
  }
  signOut() {
    this.authService.logout();
  }
}
