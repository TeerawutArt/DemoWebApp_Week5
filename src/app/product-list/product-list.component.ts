import { Component, OnInit } from '@angular/core';
import { ProductDto } from '../shared/dtos/product.dto';
import { ProductService } from '../shared/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    TableModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  cols!: unknown[];
  products!: ProductDto[];
  loading = false;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'price', header: 'Price' },
    ];

    this.getProducts();
  }

  private getProducts() {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (res: ProductDto[]) => {
        this.products = res;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
        this.loading = false;
      }
    });
  }
}
