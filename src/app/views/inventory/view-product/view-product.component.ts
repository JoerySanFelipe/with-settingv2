import { Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ActionType, ComponentType } from 'src/app/models/audit/audit_type';
import { Products } from 'src/app/models/products';
import { UserType } from 'src/app/models/user-type';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
declare var window: any;
@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css'],
})
export class ViewProductComponent implements OnInit, AfterViewInit {
  _product: Products | null = null;
  deleteProductModal: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public loadingService: LoadingService,
    private authService: AuthService,
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
    private auditLogService: AuditLogService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.deleteProductModal = new window.bootstrap.Modal(
      document.getElementById('deleteProductModal')
    );
  }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const products = params['product'];
      this._product = JSON.parse(products);

      this.cdr.detectChanges();
    });
  }

  deleteProduct(data: Products) {
    this.loadingService.showLoading('deleting');
    this.productService.deleteProductByID(data.id).subscribe({
      next: async (v) => {
        await this.auditLogService.saveAudit({
          id: '',
          email: this.authService.users?.email ?? 'no email',
          role: this.authService.users?.type ?? UserType.ADMIN,
          action: ActionType.DELETE,
          component: ComponentType.INVENTORY,
          payload: data,
          details: 'deleting product from inventory',
          timestamp: Timestamp.now(),
        });

        this.deleteProductModal.hide();
        this.loadingService.hideLoading('deleting');
        this.toastr.success(
          `${data.name} deleted successfully!`,
          'Deletion Successful'
        );
      },

      error: (v) => {
        this.toastr.error(v.message, 'Error Deleting product');
      },
    });
  }
  editProduct(product: Products) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        product: JSON.stringify(product),
      },
    };
    this.router.navigate(
      [this.authService.users?.type + '/edit-product'],
      navigationExtras
    );
  }
}
