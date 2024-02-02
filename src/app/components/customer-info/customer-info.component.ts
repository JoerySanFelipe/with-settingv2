import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Customers } from 'src/app/models/customers';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css'],
})
export class CustomerInfoComponent implements OnInit {
  @Input() customerID?: string;
  customer: Customers | null = null;
  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.customerService.getCustomerInfo(this.customerID!).then((snap) => {
      if (snap.exists()) {
        let data = snap.data();
        this.customer = data;
        this.cdr.detectChanges();
      } else {
        this.customer = null;
      }
    });
  }
  customerProfile() {
    if (this.customer?.profile != null || this.customer?.profile != '') {
      return this.customer?.profile;
    } else {
      return '../../../assets/images/profile.jpg';
    }
  }
}
