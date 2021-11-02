### Steps

#### Coach

- Create connected account when coach subscribes

```js
const account = await stripe.accounts.create({
  type: 'custom',
  country,
  email,
  default_currency: currency,
  requested_capabilities: ['transfers', 'card_payments'],
  business_type: 'individual',
  settings: {
    payouts: {
      schedule: {
        interval: 'monthly',
        monthly_anchor: 5
      }
    }
  }
});
```

- Create & Send account link for onboarding and account verification

```js
const accountLink = await stripe.accountLinks.create({
  account,
  failure_url,
  success_url,
  type: 'custom_account_verification'
});
return res.status(200).json({ accountLink });
```

- Add bank accounts and credit card to that account

```js
const card = await stripe.accounts.createExternalAccount(
  'acct_1FoQP1JbwatK9u7A',
  { external_account: 'tok_mastercard_debit' }
);
```

- Send transfers to connected account

```js
const transfer = await stripe.transfers.create({
  amount: 400,
  currency: 'usd',
  destination: 'acct_1FoQP1JbwatK9u7A',
  transfer_group: 'ORDER_95'
});
```

- Send payouts to external account

```js
const payout = await stripe.payouts.create({ amount, currency });

if (!payout) {
  return {
    success: false,
    message: 'Payout incomplete'
  };
}

return {
  success: true,
  payout: payout
};
```

#### Student

- Create customer account, either when the student signs up, or on the very first purchase

```js
const customer = await stripe.customers.create({
  description: ''
});
```

- Add cards for payments - Mobile

- Create payment intents

```js
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'usd',
  payment_method_types: ['card']
});
```

- Handle(Confirm) payment intent - Mobile

- Fullfill payment by hooks

#### Hooks

- Monitor events

```js
try {
  const endpointSecret = await createHook();
  const sig = req.headers['stripe-signature'];
  let event = null;

  event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

  let intent = null;
  switch (event['type']) {
    case 'payment_intent.succeeded':
      intent = event.data.object;
      console.log('Succeeded:', intent.id);
      break;
    case 'payment_intent.payment_failed':
      intent = event.data.object;
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log('Failed:', intent.id, message);
      break;
  }

  res.json({ message: 'Success' });
} catch (err) {
  return res.status(400).json({ message: 'Invalid signature' });
}
```
