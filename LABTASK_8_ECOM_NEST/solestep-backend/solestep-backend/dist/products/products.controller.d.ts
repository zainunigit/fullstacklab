import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getAllProducts(): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    }[];
    getProductsByCategory(category: string): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    }[];
    getProductById(id: number): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    };
    addProduct(product: any): any;
    updateProduct(id: number, product: any): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    };
    deleteProduct(id: number): {
        message: string;
    };
}
