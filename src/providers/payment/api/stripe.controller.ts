import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentInputData, Signature } from '../../../main/decorators/signature-data.decorator';
import { StripePaymentWebhookService } from '../application/stripe-payment-webhook.service';
import { PaymentPaypalService } from '../application/payment-paypal.service';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(
    private readonly stripePaymentWebhookService: StripePaymentWebhookService,
    private readonly paymentPaypalService: PaymentPaypalService,
  ) {}

  /**
   * Webhook for Stripe Api (see stripe official documentation)
   * @param inputData
   */
  @ApiOperation({ summary: 'Webhook for Stripe Api (see stripe official documentation)' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Post('stripe/webhook')
  async stripeHook(@Signature() inputData: PaymentInputData) {
    await this.stripePaymentWebhookService.createEventSession(inputData.signature, inputData.body);
  }
  @Get()
  async test() {
    return this.paymentPaypalService.testCreateSession2();
  }
}
