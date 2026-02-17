/**
 * FreePeriod — Purchase Verification
 *
 * GET /api/verify-purchase?session_id=cs_...
 * Verifies a completed Stripe Checkout Session and returns download info.
 *
 * Environment variables required:
 *   STRIPE_SECRET_KEY — sk_live_... or sk_test_...
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = req.query.session_id;

  if (!sessionId || !sessionId.startsWith('cs_')) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(402).json({
        error: 'Payment not completed',
        status: session.payment_status,
      });
    }

    // Return purchase confirmation with download links
    res.status(200).json({
      success: true,
      customer_email: session.customer_details?.email,
      product: session.metadata?.product,
      downloads: {
        canvas: '/downloads/freeperiod-canvas.mcpb',
        google: '/downloads/freeperiod-google.mcpb',
        microsoft: '/downloads/freeperiod-microsoft.mcpb',
        setup_guide: '/downloads/setup-guide.pdf',
        system_prompt: '/downloads/system-prompt.txt',
      },
    });
  } catch (error) {
    console.error('Verify error:', error.message);
    res.status(500).json({ error: 'Failed to verify purchase' });
  }
};
