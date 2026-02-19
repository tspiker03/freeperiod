/**
 * FreePeriod — Free Tools Email Delivery
 *
 * POST /api/send-free-tools
 * Body: { email: "teacher@school.edu" }
 *
 * 1. Submits email to Google Forms (lead capture)
 * 2. Sends welcome email via Resend with the free tools link
 * 3. Returns success so the frontend can redirect to /free-tools
 *
 * Environment variables:
 *   RESEND_API_KEY — Required for sending welcome emails
 */

// ---------- Welcome email HTML ----------
function buildWelcomeEmail() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Free AI Teaching Tools</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f0;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid rgba(26,26,46,0.08);overflow:hidden;">

  <!-- Header -->
  <tr>
    <td style="background:#0d9488;padding:32px 40px;text-align:center;">
      <div style="font-size:28px;margin-bottom:8px;">&#x1F514;</div>
      <h1 style="color:#ffffff;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.5px;">
        Your Free AI Teaching Tools
      </h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">
        from Free Period
      </p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:36px 40px 24px;">
      <p style="color:#1a1a2e;font-size:16px;line-height:1.7;margin:0 0 20px;">
        You just unlocked 4 AI-powered teaching commands that work inside Claude. Here's how to start using them in about 2 minutes.
      </p>

      <p style="color:#8888a0;font-size:13px;line-height:1.5;margin:0 0 20px;padding:10px 16px;background:rgba(13,148,136,0.04);border-radius:8px;border-left:3px solid #0d9488;">
        <strong style="color:#4a4a5e;">Don't see future emails from us?</strong> Check your <strong>Promotions</strong> or <strong>Spam</strong> folder and move this email to your Primary inbox so you never miss an update.
      </p>

      <!-- CTA Button -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:8px 0 28px;">
            <a href="https://freeperiod.co/free-tools"
               style="background:#0d9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:16px;font-weight:700;display:inline-block;">
              Get Your Free Tools &rarr;
            </a>
          </td>
        </tr>
      </table>

      <p style="color:#4a4a5e;font-size:14px;line-height:1.6;margin:0 0 24px;">
        That link takes you to a page with your system prompt (ready to copy) and step-by-step setup instructions. Bookmark it &mdash; it's always available.
      </p>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid rgba(26,26,46,0.08);margin:0 0 24px;">

      <!-- 4 Commands -->
      <h2 style="color:#1a1a2e;font-size:18px;font-weight:700;margin:0 0 16px;">
        Your 4 Free Commands
      </h2>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr>
          <td style="padding:12px 16px;background:rgba(13,148,136,0.06);border-radius:10px;margin-bottom:8px;">
            <span style="color:#0d9488;font-weight:700;font-size:15px;">/plan</span>
            <span style="color:#4a4a5e;font-size:14px;"> &mdash; Generate a full lesson plan</span>
            <br>
            <span style="color:#8888a0;font-size:13px;font-style:italic;">Try: /plan photosynthesis 7th grade</span>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:rgba(13,148,136,0.06);border-radius:10px;">
            <span style="color:#0d9488;font-weight:700;font-size:15px;">/rubric</span>
            <span style="color:#4a4a5e;font-size:14px;"> &mdash; Build a scoring rubric</span>
            <br>
            <span style="color:#8888a0;font-size:13px;font-style:italic;">Try: /rubric persuasive essay 10th grade</span>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:rgba(13,148,136,0.06);border-radius:10px;">
            <span style="color:#0d9488;font-weight:700;font-size:15px;">/differentiate</span>
            <span style="color:#4a4a5e;font-size:14px;"> &mdash; Adapt for all learners</span>
            <br>
            <span style="color:#8888a0;font-size:13px;font-style:italic;">Try: /differentiate this fraction lesson</span>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:rgba(13,148,136,0.06);border-radius:10px;">
            <span style="color:#0d9488;font-weight:700;font-size:15px;">/quiz</span>
            <span style="color:#4a4a5e;font-size:14px;"> &mdash; Create a quick assessment</span>
            <br>
            <span style="color:#8888a0;font-size:13px;font-style:italic;">Try: /quiz American Revolution 8th grade</span>
          </td>
        </tr>
      </table>

      <!-- Divider -->
      <hr style="border:none;border-top:1px solid rgba(26,26,46,0.08);margin:0 0 24px;">

      <!-- Free Course CTA -->
      <h2 style="color:#1a1a2e;font-size:18px;font-weight:700;margin:0 0 12px;">
        &#x1F393; Want to go deeper?
      </h2>
      <p style="color:#4a4a5e;font-size:14px;line-height:1.6;margin:0 0 16px;">
        Our free course &mdash; <strong>Intro to AI for Teachers</strong> &mdash; walks you through 5 modules: the RCTFC prompting framework, how MCP connects AI to your tools, building reusable skills, and putting it all together into your own AI teaching assistant.
      </p>
      <a href="https://classroom.google.com/c/ODI1NTQ2NjYwNDYz?cjc=fp4iwvy"
         style="color:#0d9488;font-weight:700;font-size:14px;text-decoration:underline;">
        Join the free course on Google Classroom &rarr;
      </a>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding:24px 40px 32px;border-top:1px solid rgba(26,26,46,0.08);">
      <p style="color:#8888a0;font-size:12px;line-height:1.6;margin:0;text-align:center;">
        Free Period by AI4Teachers &mdash; AI tools built for educators.<br>
        <a href="https://freeperiod.co" style="color:#0d9488;text-decoration:none;">freeperiod.co</a>
        &nbsp;&middot;&nbsp;
        <a href="https://ai4teachers.co" style="color:#0d9488;text-decoration:none;">ai4teachers.co</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ---------- API handler ----------
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

    // Submit to Google Forms for lead tracking (fire-and-forget)
    const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScgwMboGki238NhxCjm2Xolbl_6CM5I4qo8jd7C8x4FoNdVbw/formResponse';
    const formData = new URLSearchParams();
    formData.append('entry.2116253119', email);

    fetch(googleFormUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    }).catch(() => {
      console.log('Google Form submission failed for:', email);
    });

    // Send welcome email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Free Period <hello@freeperiod.co>',
            to: email,
            subject: 'Your Free AI Teaching Tools Are Ready!',
            html: buildWelcomeEmail(),
          }),
        });

        if (!emailRes.ok) {
          const errBody = await emailRes.text();
          console.error('Resend error:', emailRes.status, errBody);
        } else {
          console.log('Welcome email sent to:', email);
        }
      } catch (emailErr) {
        // Email failure shouldn't block the signup flow
        console.error('Email send failed:', emailErr.message);
      }
    } else {
      console.log('RESEND_API_KEY not set — skipping email for:', email);
    }

    // Log for analytics
    console.log('=== FREE TOOLS SIGNUP ===');
    console.log('Email:', email);
    console.log('Time:', new Date().toISOString());
    console.log('========================');

    return res.status(200).json({
      success: true,
      redirect: '/free-tools',
    });
  } catch (error) {
    console.error('Free tools signup error:', error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
