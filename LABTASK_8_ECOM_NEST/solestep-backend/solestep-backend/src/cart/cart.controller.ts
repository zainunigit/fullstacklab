import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Get('summary')
  getSummary() {
    return this.cartService.getSummary();
  }

  @Post('items')
  addToCart(@Body() item: any) {
    return this.cartService.addToCart(item);
  }

  @Patch('items/:id')
  updateItem(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.cartService.updateItem(id, data);
  }

  @Delete('items/:id')
  removeItem(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeItem(id);
  }

  @Delete()
  clearCart() {
    return this.cartService.clearCart();
  }
}
