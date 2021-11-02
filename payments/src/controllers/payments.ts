import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/errorResponse';
import { stripe } from '../config/stripe';

/**
 * @desc Creates a connected account and returns it
 * @route POST /api/v1/payments/accounts
 * @access Private
 */
export const createAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      firstName,
      lastName,
      country = 'US',
      currency = 'usd',
      accountType = 'individual',
      metadata,
      type = 'express'
    } = req.body;

    const account = await stripe.accounts.create(
      {
        type: type,
        country: country?.toUpperCase(),
        capabilities: {
          transfers: {
            requested: true
          },
          card_payments: {
            requested: true
          }
        },
        email: email,
        default_currency: currency,
        business_type: accountType,
        individual: {
          first_name: firstName,
          last_name: lastName,
          email: email
        },
        settings: {
          payouts: {
            schedule: {
              interval: 'manual'
            }
          }
        },
        metadata
      },
      { maxNetworkRetries: 2 }
    );

    return res.status(201).json(account);
  }
);

interface AccountLinkRequest {
  account: string;
  refreshUrl: string;
  returnUrl: string;
}

/**
 * @desc
 * @route POST /api/v1/payments/
 * @access Private
 */
export const createAccountLink = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { account, refreshUrl, returnUrl }: AccountLinkRequest = req.body;

    const accountLink = await stripe.accountLinks.create({
      account: account,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding'
    });

    return res.send(accountLink);
  }
);

/**
 * @desc Creates and returns a new customer
 * @route POST /api/v1/payments/customers
 * @access Private
 */
export const createCustomer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, name, desciption, metadata } = req.body;

    const customer = await stripe.customers.create({
      description: desciption || email,
      email: email,
      name: name,
      metadata
    });

    return res.status(201).json(customer);
  }
);

/**
 * @desc Creates and returns a transfer
 * @route POST /api/v1/payments/transfers
 * @access Private
 */
export const createTransfer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { connectedAccount, amount, currency, transferGroup } = req.body;

    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: currency,
      destination: connectedAccount,
      transfer_group: transferGroup
    });

    return res.status(201).json(transfer);
  }
);

/**
 * @desc  Creates a payout to a bank account id on behalf of a connected account
 * @route POST /api/v1/payments/payouts
 * @access Private
 */
export const createPayout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bankAccount, connectedAccount, amount, currency } = req.body;

    const payout = await stripe.payouts.create(
      {
        amount: amount * 100,
        currency: currency,
        destination: bankAccount,
        method: 'standard'
      },
      { stripeAccount: connectedAccount }
    );

    return res.status(200).json(payout);
  }
);

/**
 * @desc Creates, attaches and returns a bank account
 * @route POST /api/v1/payments/
 * @access Private
 */
export const attachBankToAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      country,
      currency,
      holderName,
      holderType = 'individual',
      routingNumber,
      accountNumber
    } = req.body;

    const { type } = await stripe.accounts.retrieve(req.params.id);

    // if (type !== 'custom') {
    //   return res.status(400).send({
    //     error: 'Cannot set external accounts on non custom accounts'
    //   });
    // }

    const token = await stripe.tokens.create({
      bank_account: {
        country: country,
        currency: currency,
        account_holder_name: holderName,
        account_holder_type: holderType,
        routing_number: routingNumber,
        account_number: accountNumber
      }
    });

    const bankAccount = await stripe.accounts.createExternalAccount(
      req.params.account,
      { external_account: token.id }
    );

    return res.status(201).json(bankAccount);
  }
);

/**
 * @desc Creates a payment intent and returns its client secret
 * @route POST /api/v1/payments/payment-intents
 * @access Private
 */
export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      amount,
      currency,
      paymentMethodTypes,
      appFee,
      connectedAccount,
      metadata
    } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      payment_method_types: paymentMethodTypes || ['card'],
      application_fee_amount: appFee,
      // on_behalf_of: 'event-coach-stripe-id',
      // receipt_email: 'student-email',
      transfer_data: {
        destination: connectedAccount
      },
      metadata
    });

    return res.status(200).json(paymentIntent);
  }
);

/**
 * @desc Monitors and listens for webhooks from stripe, and does things on them
 * @route POST /api/v1/payments/
 * @access Private
 */
export const monitorHooks = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // With signature verification:
      const payload = req.body;
      const signature = req.headers['stripe-signature'];
      const signingSecret = process.env.STRIPE_WEBHOOKS_SECRET;

      let event = stripe.webhooks.constructEvent(
        payload,
        signature,
        signingSecret
      );

      switch (event.type) {
        case 'account.updated':
          const account = event.data.object;
          console.log(account);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
          break;
      }

      res.status(200).send();
    } catch (error) {
      console.log(error.message);
      res.status(400).send(error);
    }
  }
);
