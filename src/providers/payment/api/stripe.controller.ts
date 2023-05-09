import { Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentInputData, Signature } from '../../../main/decorators/signature-data.decorator';
import { StripeService } from '../application/stripe.service';
import { StripePaymentWebhookService } from '../application/stripe-payment-webhook.service';

@ApiTags('payments')
@Controller('payments')
export class StripeController {
  constructor(
    private readonly stripePaymentWebhookService: StripePaymentWebhookService,
    private readonly stripeService: StripeService,
  ) {}

  @ApiOperation({ summary: 'Webhook for Stripe Api (see stripe official documentation)' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('stripe/webhook')
  async stripeHook(@Signature() inputData: PaymentInputData) {
    await this.stripePaymentWebhookService.createEventSession(inputData.signature, inputData.body);
    // await this.stripeService.createCheckoutSession(inputData.signature, inputData.body);
  }

  @Get(`stripe/buy`)
  async buy(@Query('productIds') productIds) {
    return await this.stripeService.subscription();
  }
  //
  // @Get(`stripe`)
  // async b(@Query('productIds') productIds) {
  //   return await this.stripeService.subscription();
  // }
  //
  // @Get(`stripe/success`)
  // async success() {
  //   return 'success';
  // }
  //
  // @Get(`stripe/cancel`)
  // async cancel() {
  //   return 'cancel';
  // }
}
