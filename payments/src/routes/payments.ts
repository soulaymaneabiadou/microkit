import express from 'express';
const router = require('express').Router();
import {
  createAccount,
  createAccountLink,
  createCustomer,
  attachBankToAccount,
  createPaymentIntent,
  createPayout,
  createTransfer,
  monitorHooks
} from '../controllers/payments';

router.route('/accounts').post(createAccount);
router.route('/account-links').post(createAccountLink);
router.route('/customers').post(createCustomer);
router.route('/transfers').post(createTransfer);
router.route('/payouts').post(createPayout);
router.route('/accounts/:account/methods').post(attachBankToAccount);
router.route('/payment-intents').post(createPaymentIntent);

router
  .route('/webhooks')
  .post(express.raw({ type: 'application/json' }), monitorHooks);

export default router;
