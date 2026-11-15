export declare class UsersService {
    private users;
    private idCounter;
    register(data: any): {
        id: number;
        fullName: any;
        email: any;
    };
    getAllUsers(): any[];
    getUserById(id: number): any;
    findByEmail(email: string): any;
    updateUser(id: number, data: any): any;
    deleteUser(id: number): {
        message: string;
    };
}
