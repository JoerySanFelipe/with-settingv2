import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Audit } from 'src/app/models/audit/audit';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-audit',
  templateUrl: './view-audit.component.html',
  styleUrls: ['./view-audit.component.css'],
})
export class ViewAuditComponent implements OnInit {
  _audit: Audit | null = null;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    public location: Location
    ) {}
    
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const auditLog = params['audit'];

      const audit: Audit = JSON.parse(auditLog);
      this._audit = audit;

      console.log('Transaction:', audit);
    });
  }

  formatAudit(audit: Audit) {
    return audit;
  }
}