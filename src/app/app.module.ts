import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { LoginComponent } from './views/auth/login/login.component';
import { SignupComponent } from './views/auth/signup/signup.component';
import { AdminMainComponent } from './views/admin/admin-main/admin-main.component';
import { StaffMainComponent } from './views/staff/staff-main/staff-main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { DashboardComponent } from './views/admin/dashboard/dashboard.component';
import { ProductComponent } from './views/inventory/product/product.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimaryButtonComponent } from './components/primary-button/primary-button.component';
import { HeaderComponent } from './components/header/header.component';
import { ReportsComponent } from './views/admin/reports/reports.component';
import { CustomerComponent } from './views/admin/customer/customer.component';
import { OrdersComponent } from './views/admin/orders/orders.component';
import { UsersComponent } from './views/admin/user/users/users.component';
import { AuditComponent } from './views/admin/audit/audit.component';
import { ContentsComponent } from './views/admin/contents/contents.component';
import { ViewProductComponent } from './views/inventory/view-product/view-product.component';
import { AddUserComponent } from './views/admin/user/add-user/add-user.component';
import { AddProductComponent } from './views/inventory/add-product/add-product.component';
import { AddVariationComponent } from './views/inventory/add-variation/add-variation.component';
import { DeleteProductDialogComponent } from './components/delete-product-dialog/delete-product-dialog.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { StaffHomeComponent } from './views/staff/staff-home/staff-home.component';
import { TransactionsComponent } from './views/staff/transactions/transactions.component';
import { ConfirmCheckoutComponent } from './views/staff/confirm-checkout/confirm-checkout.component';
import { ViewOrdersComponent } from './views/staff/view-orders/view-orders.component';
import { AddPestComponent } from './views/admin/add-pest/add-pest.component';
import { FormsModule } from '@angular/forms';
import { AddTopicComponent } from './views/admin/add-topic/add-topic.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgChartsModule, NgChartsConfiguration } from 'ng2-charts';
import { ReviewTransactionComponent } from './views/admin/review-transaction/review-transaction.component';
import { StaffInfoComponent } from './components/staff-info/staff-info.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AddDriverComponent } from './components/add-driver/add-driver.component';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { ViewAuditComponent } from './views/admin/view-audit/view-audit.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { EditProductComponent } from './views/inventory/edit-product/edit-product.component';
import { AddStocksComponent } from './views/inventory/add-stocks/add-stocks.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './views/admin/settings/settings.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    AdminMainComponent,
    StaffMainComponent,
    NotFoundComponent,
    DashboardComponent,
    ProductComponent,
    PrimaryButtonComponent,
    HeaderComponent,
    ReportsComponent,
    CustomerComponent,
    OrdersComponent,
    UsersComponent,
    AuditComponent,
    ContentsComponent,
    ViewProductComponent,
    AddUserComponent,
    AddProductComponent,
    AddVariationComponent,
    DeleteProductDialogComponent,
    CustomerInfoComponent,
    StaffHomeComponent,
    TransactionsComponent,
    ConfirmCheckoutComponent,
    ViewOrdersComponent,
    AddPestComponent,
    AddTopicComponent,
    ReviewTransactionComponent,
    StaffInfoComponent,
    ProfileComponent,
    AddDriverComponent,
    AddPaymentComponent,
    ViewAuditComponent,
    EditProductComponent,
    AddStocksComponent,
    SearchComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxJsonViewerModule,
    NgxDaterangepickerMd.forRoot(),
    NgChartsModule.forRoot({ defaults: {} }),
    AppRoutingModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
