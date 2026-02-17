/**
 * FreePeriod — Free Tools Email Delivery
 *
 * POST /api/send-free-tools
 * Body: { email: "teacher@school.edu" }
 *
 * 1. Submits email to Google Forms (lead capture)
 * 2. Returns success so the frontend can redirect to /free-tools
 *
 * Future: Add Resend/SendGrid integration to email the system prompt directly.
 *
 * Environment variables (optional, for future email delivery):
 *   RESEND_API_KEY — For sending welcome emails
 */

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    const data = JSON.parse(body);
    const email = data.email;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email required' });
    }

    // Submit to Google Forms for lead tracking
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScgwMboGki238NhxCjm2Xolbl_6CM5I4qo8jd7C8x4FoNdVbw/formResponse';
    const formData = new URLSearchParams();
    formData.append('entry.2116253119', email);

    // Fire-and-forget to Google Forms
    fetch(googleFormUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    }).catch(() => {
      // Non-critical — we still deliver the tools
      console.log('Google Form submission failed for:', email);
    });

    // Log for analytics
    console.log('=== FREE TOOLS SIGNUP ===');
    console.log('Email:', email);
    console.log('Time:', new Date().toISOString());
    console.log('========================');

    // Future: Send welcome email with Resend
    // if (process.env.RESEND_API_KEY) {
    //   await fetch('https://api.resend.com/emails', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       from: 'Free Period <hello@freeperiod.co>',
    //       to: email,
    //       subject: 'Your Free AI Teaching Tools Are Ready!',
    //       html: welcomeEmailHtml,
    //     }),
    //   });
    // }

    return res.status(200).json({
      success: true,
      redirect: '/free-tools',
    });
  } catch (error) {
    console.error('Free tools signup error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
