import React from 'react';

interface ConfirmationEmailProps {
  verificationUrl: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({ verificationUrl }) => {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>Welcome to 100AFRO!</h1>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', marginTop: '20px' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Thank you for subscribing to our newsletter! We're excited to have you join our community.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '30px' }}>
            Please confirm your email address by clicking the button below:
          </p>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <a
              href={verificationUrl}
              style={{
                backgroundColor: '#10b981',
                color: '#fff',
                padding: '12px 30px',
                textDecoration: 'none',
                borderRadius: '5px',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Confirm Email Address
            </a>
          </div>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style={{ fontSize: '12px', color: '#999', wordBreak: 'break-all' }}>
            {verificationUrl}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            This link will expire in 24 hours.
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
          <p style={{ marginTop: '10px' }}>© 2024 100AFRO. All rights reserved.</p>
        </div>
      </body>
    </html>
  );
};

export const ConfirmationEmailText = ({ verificationUrl }: { verificationUrl: string }) => {
  return `Welcome to 100AFRO!

Thank you for subscribing to our newsletter! We're excited to have you join our community.

Please confirm your email address by visiting this link:
${verificationUrl}

This link will expire in 24 hours.

If you didn't subscribe to our newsletter, you can safely ignore this email.

© 2024 100AFRO. All rights reserved.`;
};
