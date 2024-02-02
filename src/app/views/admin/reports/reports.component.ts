import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Order, Products, productToOrder } from 'src/app/models/products';
import { OrderItems } from 'src/app/models/transaction/order_items';
import { Transactions } from 'src/app/models/transaction/transactions';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
import { TransactionsService } from 'src/app/services/transactions.service';
import { formatPrice, months } from 'src/app/utils/constants';
import { ProductCalculator } from 'src/app/utils/product_calc';
import { TransactionCalculator } from 'src/app/utils/transaction_calc';

export interface BestSellingCategories {
  category: string;
  totalSales: number;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  _topSellingCategories: BestSellingCategories[] = [];
  _transactionCalculator: TransactionCalculator = new TransactionCalculator([]);
  _productCalculator: ProductCalculator = new ProductCalculator([]);
  _productList: Products[] = [];
  _lowStocks: Order[] = [];
  _productItemList: Order[] = [];

  _transactionList: Transactions[] = [];
  public barChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData = [
    {
      data: [10000, 20000, 30000, 40000, 50000, 60000],
      label: 'Sales',
    },
    {
      data: [10000, 20000, 30000, 40000, 50000, 60000],
      label: 'Revenue',
    },
  ];

  constructor(
    private transactionService: TransactionsService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: Products[]) => {
      this._productList = data;
      this._productCalculator = new ProductCalculator(data);
      this._productList.map((product) => {
        this._productItemList.push(...productToOrder(product));
        this._productItemList.sort((a, b) => a.stocks - b.stocks);
        this._lowStocks = this._productItemList.slice(0, 5);
      });

      this.cdr.detectChanges();
    });
    this.transactionService
      .getTransactionsForCurrentYear()
      .subscribe((data) => {
        this._transactionList = data;
        this._transactionCalculator = new TransactionCalculator(data);
        this.barChartLabels = months;
        this.barChartData[0].data =
          this._transactionCalculator.generateTotalSalesPerMoth(months);

        console.log('Transactions', this.barChartData[0]);
        this.barChartData[1].data =
          this._transactionCalculator.generateRevenuePerMonth(months);

        console.log('Revenue', this.barChartData[1]);
        this.cdr.detectChanges();
      });
  }

  formatPrice(num: number) {
    return formatPrice(num);
  }

  getProduct(productID: string) {
    const product = this._productList.find(
      (product) => product.id === productID
    );
    if (product) {
      return product;
    } else {
      return null;
    }
  }

  countRemaining(name: string, items: Order[]): number {
    let count = 0;
    items.map((data) => {
      if (name == data.name) {
        count += data.stocks;
      }
    });
    return count;
  }
  getBestSellingCategories() {
    let categories = new Set(
      this._productList.map((e) => e.category.toLocaleLowerCase())
    );
  }
}
