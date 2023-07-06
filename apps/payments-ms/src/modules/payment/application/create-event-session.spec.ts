import { StripePaymentWebhookService } from './stripe-payment-webhook.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException } from '@nestjs/common';

describe('createEventSession', () => {
  let stripeMock;
  let eventEmitterMock: EventEmitter2;
  let createEventSession: StripePaymentWebhookService;

  beforeEach(() => {
    // Mock the dependencies
    stripeMock = {
      webhooks: {
        constructEvent: jest.fn(),
      },
    };

    eventEmitterMock = new EventEmitter2();

    // Create an instance of the function with mocked dependencies
    createEventSession = new StripePaymentWebhookService(stripeMock, eventEmitterMock);
  });

  it.skip('should emit successSubscription event for checkout.session.completed', async () => {
    // Arrange
    const signature = 'testSignature';
    const body = Buffer.from('testBody');
    const eventMock = {
      type: 'checkout.session.completed',
      data: {
        object: 'testObject',
      },
    };

    stripeMock.webhooks.constructEvent.mockReturnValueOnce(eventMock);

    // Act
    await createEventSession.createEventSession(signature, body);

    // Assert
    expect(eventEmitterMock.emit).toHaveBeenCalledWith('successSubscription', eventMock.data.object);
  });

  it.skip('should emit failedSubscription event for invoice.payment_failed', async () => {
    // Arrange
    const signature = 'testSignature';
    const body = Buffer.from('testBody');
    const eventMock = {
      type: 'invoice.payment_failed',
      data: {
        object: 'testObject',
      },
    };

    stripeMock.webhooks.constructEvent.mockReturnValueOnce(eventMock);

    // Act
    await createEventSession.createEventSession(signature, body);

    // Assert
    expect(eventEmitterMock.emit).toHaveBeenCalledWith('failedSubscription', eventMock.data.object);
  });

  it('should throw BadRequestException for any other event type', async () => {
    // Arrange
    const signature = 'testSignature';
    const body = Buffer.from('testBody');
    const eventMock = {
      type: 'other.event.type',
      data: {
        object: 'testObject',
      },
    };

    stripeMock.webhooks.constructEvent.mockReturnValueOnce(eventMock);

    // Act and Assert
    await expect(createEventSession.createEventSession(signature, body)).rejects.toThrow(BadRequestException);
  });
});
