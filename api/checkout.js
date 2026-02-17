/**
 * FreePeriod — Stripe Checkout Session Creator
 *
 * POST /api/checkout
 * Creates a Stripe Checkout Session for the Pro Toolkit ($59 one-time).
 * Redirects to Stripe's hosted payment page.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY — sk_live_... or sk_test_...
 *   DOMAIN — https://freeperiod.co (or http://localhost:3000 for dev)
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const domain = process.env.DOMAIN || 'https://freeperiod.co';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FreePeriod Pro Toolkit',
              description: '13 AI teaching skills + 3 MCP integrations (Canvas, Google, Microsoft 365) for Claude Desktop',
              images: [`${domain}/icon.png`],
            },
            unit_amount: 5900, // $59.00
          },
          quantity: 1,
        },
      ],
      // Collect email for delivery
      customer_email: req.body?.email || undefined,
      customer_creation: 'always',

      // Success & cancel URLs
      success_url: `${domain}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domain}/#pricing`,

      // Allow promotion codes
      allow_promotion_codes: true,

      // Metadata for webhook processing
      metadata: {
        product: 'freeperiod-pro-toolkit',
        version: '1.0.0',
      },
    });

    // Redirect to Stripe Checkout
    res.status(303).setHeader('Location', session.url);
    res.end();
  } catch (error) {
    console.error('Checkout error:', error.message);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message
    });
  }
};
