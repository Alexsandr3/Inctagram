import { Controller, Get, HttpCode, Post, Query, RawBodyRequest, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { StripeService } from '../application/stripe.service';

@ApiTags('payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiOperation({ summary: 'Webhook for Stripe Api (see stripe official documentation)' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('stripe/webhook')
  async stripeHook(@Req() request: RawBodyRequest<Request>) {
    const signature = request.headers['stripe-signature'];
    const body = request.rawBody;
    await this.stripeService.createCheckoutSession(signature, body);
    return;
  }

  @Get(`stripe/buy`)
  async buy(@Query('productIds') productIds) {
    return await this.stripeService.createBuy(productIds);
  }

  @Get(`stripe`)
  async b(@Query('productIds') productIds) {
    return await this.stripeService.subscription();
  }

  @Get(`stripe/success`)
  async success() {
    return 'success';
  }

  @Get(`stripe/cancel`)
  async cancel() {
    return 'cancel';
  }
}
