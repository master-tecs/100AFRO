import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { getConfirmationEmailHtml, ConfirmationEmailText } from '@/lib/emails/confirmation-email';

const emailSchema = z.string().email('Invalid email address');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email;

    // Server-side email validation
    const validationResult = emailSchema.safeParse(email);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const validatedEmail = validationResult.data;

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedEmail },
    });

    if (existing) {
      // If already verified, return success
      if (existing.verified) {
        return NextResponse.json(
          { message: 'Email already subscribed', verified: true },
          { status: 200 }
        );
      }

      // If not verified, generate new token and resend confirmation
      const verificationToken = randomBytes(32).toString('hex');
      await prisma.newsletterSubscriber.update({
        where: { email: validatedEmail },
        data: {
          verificationToken,
        },
      });

      // Send confirmation email
      if (resend) {
        const verificationUrl = `${SITE_URL}/newsletter/confirm?token=${verificationToken}`;
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: validatedEmail,
            subject: 'Confirm your subscription to 100AFRO',
            html: getConfirmationEmailHtml(verificationUrl),
            text: ConfirmationEmailText({ verificationUrl }),
          });
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
          // Continue even if email fails
        }
      }

      return NextResponse.json(
        { 
          message: 'Confirmation email sent. Please check your inbox to verify your subscription.',
          pending: true 
        },
        { status: 200 }
      );
    }

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Create new subscriber with pending verification
    await prisma.newsletterSubscriber.create({
      data: {
        email: validatedEmail,
        active: true,
        verified: false,
        verificationToken,
      },
    });

    // Send confirmation email
    if (resend) {
      const verificationUrl = `${SITE_URL}/newsletter/confirm?token=${verificationToken}`;
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: validatedEmail,
          subject: 'Confirm your subscription to 100AFRO',
          html: getConfirmationEmailHtml(verificationUrl),
          text: ConfirmationEmailText({ verificationUrl }),
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue even if email fails - user can still verify via link
      }
    }

    return NextResponse.json(
      { 
        message: 'Subscription pending. Please check your email to confirm your subscription.',
        pending: true 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

