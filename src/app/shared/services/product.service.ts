import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductDto } from '../dtos/product.dto';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getProducts() {
    let reqUrl = environment.apiBaseUrl + '/products';
    return this.http.get<ProductDto[]>(reqUrl);
  }
}
