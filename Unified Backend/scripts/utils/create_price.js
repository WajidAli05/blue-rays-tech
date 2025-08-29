import Stripe from 'stripe';

const stripe = new Stripe('sk_test_BQokikJOvBiI2HlWgH4olfQ2');

const product = await stripe.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
});

const price = await stripe.prices.create({
  unit_amount: 1200,
  currency: 'usd',
  recurring: { interval: 'month' },
  product: product.id,
});

console.log('Success! Product ID:', product.id);
console.log('Success! Price ID:', price.id);