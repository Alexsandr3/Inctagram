import { Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripePaymentWebhookService } from '@payments-ms/modules/payment/application/stripe-payment-webhook.service';
import { PaymentInputData, Signature } from '@payments-ms/main/decorators/signature-data.decorator';
import { SwaggerDecoratorsByWebHook } from '@payments-ms/modules/payment/swagger/swagger.payment.decorators';
import { HTTP_Status } from '@common/main/enums/http-status.enum';

@ApiTags('Payments')
@Controller('payments')
export class StripeController {
  constructor(private readonly stripePaymentWebhookService: StripePaymentWebhookService) {}

  /**
   * Webhook for Stripe Api (see stripe official documentation)
   * @param inputData
   */
  @SwaggerDecoratorsByWebHook()
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  @Post('stripe/webhook')
  async stripeHook(@Signature() inputData: PaymentInputData): Promise<void> {
    await this.stripePaymentWebhookService.createEventSession(inputData.signature, inputData.body);
  }
}
