import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Products } from 'src/app/models/products';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-delete-product-dialog',
  templateUrl: './delete-product-dialog.component.html',
  styleUrls: ['./delete-product-dialog.component.css'],
})
export class DeleteProductDialogComponent {
  @Input() product?: Products;
  confirm: string = '';
  @Output() onSubmit = new EventEmitter<Products>();
  constructor(public loadingService: LoadingService) {}
  onChange(event: any) {
    this.confirm = event.target.value;
  }
  confirmDelete() {
    if (this.product !== null) {
      this.onSubmit.emit(this.product);
    }
  }
}
