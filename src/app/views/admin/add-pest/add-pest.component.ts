import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { PestMap } from 'src/app/models/pest';

import { LoadingService } from 'src/app/services/loading.service';
import { PestService } from 'src/app/services/pest.service';
import { ProductService } from 'src/app/services/product.service';

declare var window: any;
@Component({
  selector: 'app-add-pest',
  templateUrl: './add-pest.component.html',
  styleUrls: ['./add-pest.component.css'],
})
export class AddPestComponent implements OnInit {
  _selectedPestFile: File | null = null;
  _data: string[] = [];
  _pestMapList: PestMap[] = [];
  _pestForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  _selectedPest: string | null = null;
  topicModal: any;
  constructor(
    public location: Location,
    private pestMapService: PestService,
    public loadingService: LoadingService,
    private toastrService: ToastrService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.topicModal = new window.bootstrap.Modal(
      document.getElementById('topicModal')
    );
    this.pestMapService.getAllPestMap().subscribe((data) => {
      this._pestMapList = data;
    });
  }
  selectedPest(index: number) {
    if (this._pestMapList && index >= 0 && index < this._pestMapList.length) {
      this._selectedPest = this._pestMapList[index].id;
      this.topicModal.show();
    } else {
      this._selectedPest = null;
    }
  }
  onSelectPestMapFile(event: any) {
    const files = event.target.files[0];
    this._selectedPestFile = files;
  }

  isCardClicked: boolean = false;
  cardTitle: string = 'Card Title';
  cardContent: string = 'Card Content';

  onClick() {
    this.isCardClicked = true;
  }
  resetCard() {
    this.isCardClicked = false;
  }
  async addPest() {
    if (this._pestForm.valid && this._selectedPestFile != null) {
      this.loadingService.showLoading('new-pest');
      try {
        const result = await this.pestMapService.uploadPestImage(
          this._selectedPestFile
        );
        let title = this._pestForm.controls.title.value;
        const pest: PestMap = {
          id: '',
          title: title ?? '',
          image: result,
          topic: [],
          createdAt: Timestamp.now(),
        };
        this.saveNewPestMap(pest);
      } catch (err: any) {
        this.toastrService.error(err.toString());
        this.loadingService.hideLoading('new-pest');
      }
    }
  }

  saveNewPestMap(pest: PestMap) {
    this.pestMapService
      .addPestmap(pest)
      .then(() => this.toastrService.success('Successfully added!'))
      .catch((err: any) => this.toastrService.error(err.toString()))
      .finally(() => {
        this.loadingService.hideLoading('new-pest');
        this.resetCard();
      });
  }
}
