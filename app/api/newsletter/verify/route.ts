import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getWelcomeEmailHtml, WelcomeEmailText } from '@/lib/emails/welcome-email';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/newsletter/confirm?error=missing_token', request.url));
    }

    if (!prisma) {
      return NextResponse.redirect(new URL('/newsletter/confirm?error=database_error', request.url));
    }

    // Find subscriber by verification token
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { verificationToken: token },
    });

    if (!subscriber) {
      return NextResponse.redirect(new URL('/newsletter/confirm?error=invalid_token', request.url));
    }

    // Check if already verified
    if (subscriber.verified) {
      return NextResponse.redirect(new URL('/newsletter/confirm?verified=true', request.url));
    }

    // Verify the subscriber
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        verified: true,
        verifiedAt: new Date(),
        active: true,
      },
    });

    // Send welcome email
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: 'Welcome to 100AFRO!',
          html: getWelcomeEmailHtml(),
          text: WelcomeEmailText(),
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue even if email fails - subscription is still verified
      }
    }

    return NextResponse.redirect(new URL('/newsletter/confirm?verified=true', request.url));
  } catch (error) {
    console.error('Error verifying newsletter subscription:', error);
    return NextResponse.redirect(new URL('/newsletter/confirm?error=verification_failed', request.url));
  }
}
