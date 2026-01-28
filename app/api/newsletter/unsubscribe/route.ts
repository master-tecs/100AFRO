import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { getUnsubscribeEmailHtml, UnsubscribeEmailText } from '@/lib/emails/unsubscribe-email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Find subscriber
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      // Return success even if not found (prevents email enumeration)
      return NextResponse.json(
        { message: 'Unsubscribed successfully' },
        { status: 200 }
      );
    }

    // Unsubscribe the subscriber
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        active: false,
        unsubscribedAt: new Date(),
      },
    });

    // Send unsubscribe confirmation email
    if (resend) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: 'You have been unsubscribed from 100AFRO',
          html: getUnsubscribeEmailHtml(),
          text: UnsubscribeEmailText(),
        });
      } catch (emailError) {
        console.error('Error sending unsubscribe email:', emailError);
        // Continue even if email fails
      }
    }

    return NextResponse.json(
      { message: 'Unsubscribed successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
