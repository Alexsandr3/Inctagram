import { Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaymentInputData, Signature } from '../../../main/decorators/signature-data.decorator';
import { StripePaymentWebhookService } from '../application/stripe-payment-webhook.service';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripePaymentWebhookService: StripePaymentWebhookService) {}

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

  @Get(':id')
  async test(@Param('id') id: string) {
    return this.stripePaymentWebhookService.listSubscriptions('price_1N5l2vIW91ghbnFjg7L4b8HR', id);
  }
}
