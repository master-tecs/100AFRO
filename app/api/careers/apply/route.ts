import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { rateLimit } from '@/lib/rate-limit';

const applySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  portfolio: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? undefined : v)),
  coverLetter: z.string().min(50).max(8000),
  role: z.string().min(1).max(120),
});

function buildNotificationHtml(data: {
  name: string;
  email: string;
  portfolio?: string;
  coverLetter: string;
  role: string;
}): string {
  const portfolioLine = data.portfolio
    ? `<p><strong>Portfolio / Work samples:</strong><br /><a href="${data.portfolio}" style="color:#F59E0B;">${data.portfolio}</a></p>`
    : '<p><strong>Portfolio:</strong> Not provided</p>';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #111827; color: #f3f4f6; margin: 0; padding: 32px; }
    .card { background: #1f2937; border: 1px solid #374151; border-left: 3px solid #F59E0B; border-radius: 8px; padding: 32px; max-width: 640px; margin: 0 auto; }
    h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; color: #fff; }
    .role { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #F59E0B; margin-bottom: 24px; }
    .divider { border: none; border-top: 1px solid #374151; margin: 20px 0; }
    p { font-size: 14px; line-height: 1.7; color: #d1d5db; margin: 0 0 14px; }
    strong { color: #f9fafb; }
    .cover { background: #111827; border: 1px solid #374151; border-radius: 6px; padding: 20px; font-size: 14px; line-height: 1.8; color: #d1d5db; white-space: pre-wrap; margin-top: 8px; }
    .footer { font-size: 11px; color: #6b7280; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>New Application — 100AFRO</h1>
    <div class="role">${data.role}</div>
    <hr class="divider" />
    <p><strong>Name:</strong><br />${data.name}</p>
    <p><strong>Email:</strong><br /><a href="mailto:${data.email}" style="color:#F59E0B;">${data.email}</a></p>
    ${portfolioLine}
    <hr class="divider" />
    <p><strong>Cover letter:</strong></p>
    <div class="cover">${data.coverLetter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    <p class="footer">Received via 100afro.com/careers · Reply directly to this email to respond to the applicant.</p>
  </div>
</body>
</html>`;
}

function buildConfirmationHtml(name: string, role: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #111827; color: #f3f4f6; margin: 0; padding: 32px; }
    .card { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 40px; max-width: 560px; margin: 0 auto; }
    .logo { font-size: 18px; font-weight: 800; color: #F59E0B; letter-spacing: 0.05em; margin-bottom: 28px; }
    h1 { font-size: 22px; font-weight: 700; color: #fff; margin: 0 0 12px; }
    p { font-size: 14px; line-height: 1.75; color: #d1d5db; margin: 0 0 14px; }
    .role-badge { display: inline-block; background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.3); color: #F59E0B; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 100px; margin-bottom: 20px; }
    .divider { border: none; border-top: 1px solid #374151; margin: 24px 0; }
    .footer { font-size: 11px; color: #6b7280; margin-top: 8px; }
    a { color: #F59E0B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">100AFRO</div>
    <div class="role-badge">${role}</div>
    <h1>We've got your application, ${name.split(' ')[0]}.</h1>
    <p>
      Thank you for applying to join the 100AFRO team. We read every application personally and we're excited to see what you've shared.
    </p>
    <p>
      <strong style="color:#f9fafb;">What happens next:</strong> If your application is a strong fit, we'll reach out within 7 days to schedule a video call with the founder.
    </p>
    <hr class="divider" />
    <p>
      In the meantime, explore what we're building at <a href="https://100afro.com">100afro.com</a>. If you have questions, email us at <a href="mailto:careers@100afro.com">careers@100afro.com</a>.
    </p>
    <p class="footer">100AFRO · Lagos · London · New York · Toronto · Johannesburg</p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, {
      windowMs: 60_000,
      max: 3,
      keyPrefix: 'careers:apply',
    });
    if (!rl.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await request.json();
    const result = applySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid submission. Please check all fields and try again.' },
        { status: 400 }
      );
    }

    const { name, email, portfolio, coverLetter, role } = result.data;

    if (resend) {
      await Promise.all([
        // Notify the team
        resend.emails.send({
          from: FROM_EMAIL,
          to: 'careers@100afro.com',
          replyTo: email,
          subject: `New Application: ${role} — ${name}`,
          html: buildNotificationHtml({ name, email, portfolio, coverLetter, role }),
        }),
        // Confirm to applicant
        resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: `Application received — ${role} at 100AFRO`,
          html: buildConfirmationHtml(name, role),
        }),
      ]);
    } else {
      // Log to console if Resend is not configured (dev mode)
      console.log('[careers/apply] New application (Resend not configured):', {
        name,
        email,
        role,
        portfolio,
        coverLetterLength: coverLetter.length,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[careers/apply] Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again or email careers@100afro.com.' },
      { status: 500 }
    );
  }
}
