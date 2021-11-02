require('dotenv').config();
import Stripe from 'stripe';

let stripe: Stripe;

if (!stripe) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
  });
}

export { stripe };
