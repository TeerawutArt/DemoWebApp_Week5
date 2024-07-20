import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css',
})
export class ForbiddenComponent implements OnInit {
  returnURL = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/';
  }
}
