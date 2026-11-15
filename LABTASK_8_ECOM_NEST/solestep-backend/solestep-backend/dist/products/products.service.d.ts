export declare class ProductsService {
    private products;
    getAllProducts(): {
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
    getProductsByCategory(category: string): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    }[];
    addProduct(data: any): any;
    updateProduct(id: number, data: any): {
        id: number;
        name: string;
        category: string;
        description: string;
        price: number;
    };
    deleteProduct(id: number): {
        message: string;
    };
    private nextId;
}
