import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Verify webhook signature from Resend
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('resend-signature');

    // Verify webhook signature if secret is set
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(body);

    // Handle different Resend webhook event types
    // Resend sends email.inbound events when emails are received
    if (payload.type === 'email.inbound' || payload.type === 'email.received') {
      const emailData = payload.data || payload;

      // Extract email information
      const from = emailData.from?.email || emailData.from || '';
      const to = emailData.to || emailData.recipient || '';
      const subject = emailData.subject || '(No Subject)';
      const textBody = emailData.text || emailData.textBody || '';
      const htmlBody = emailData.html || emailData.htmlBody || '';
      const messageId = emailData.messageId || emailData.id || null;
      const headers = emailData.headers || {};
      const attachments = emailData.attachments || [];

      if (!prisma) {
        console.error('Database not available');
        return NextResponse.json(
          { error: 'Database not available' },
          { status: 503 }
        );
      }

      // Store the incoming email
      const incomingEmail = await prisma.incomingEmail.create({
        data: {
          messageId,
          from,
          to,
          subject,
          textBody,
          htmlBody,
          headers: headers as any,
          attachments: attachments as any,
          receivedAt: new Date(),
        },
      });

      // Forward to a central email address if configured
      const forwardToEmail = process.env.INCOMING_EMAIL_FORWARD_TO;
      if (forwardToEmail && resend) {
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: forwardToEmail,
            subject: `[Forwarded] ${subject} - From: ${from}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Forwarded Email</h2>
                <p><strong>From:</strong> ${from}</p>
                <p><strong>To:</strong> ${to}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Received:</strong> ${new Date().toISOString()}</p>
                <hr style="margin: 20px 0; border: 1px solid #ddd;">
                <div style="margin-top: 20px;">
                  ${htmlBody || `<pre style="white-space: pre-wrap;">${textBody}</pre>`}
                </div>
                ${attachments.length > 0 ? `
                  <div style="margin-top: 20px;">
                    <h3>Attachments:</h3>
                    <ul>
                      ${attachments.map((att: any) => `<li>${att.filename || 'Unknown'}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `,
            text: `
Forwarded Email

From: ${from}
To: ${to}
Subject: ${subject}
Received: ${new Date().toISOString()}

${textBody}
            `.trim(),
          });
        } catch (forwardError) {
          console.error('Error forwarding email:', forwardError);
          // Continue even if forwarding fails
        }
      }

      console.log(`Incoming email stored: ${incomingEmail.id} from ${from} to ${to}`);

      return NextResponse.json(
        { 
          success: true, 
          message: 'Email received and stored',
          id: incomingEmail.id 
        },
        { status: 200 }
      );
    }

    // Handle other webhook event types if needed
    console.log('Received webhook event:', payload.type);

    return NextResponse.json(
      { success: true, message: 'Webhook received' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing incoming email webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Allow GET for webhook verification (some services use this)
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { message: 'Incoming email webhook endpoint is active' },
    { status: 200 }
  );
}
