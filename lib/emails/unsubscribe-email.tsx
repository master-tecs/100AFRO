import React from 'react';

interface UnsubscribeEmailProps {
  unsubscribeUrl: string;
}

export const UnsubscribeEmail: React.FC<UnsubscribeEmailProps> = ({ unsubscribeUrl }) => {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>100AFRO Newsletter</h1>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', marginTop: '20px' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            We're sorry to see you go!
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            You've been successfully unsubscribed from the 100AFRO newsletter.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            You will no longer receive emails from us. If you change your mind, you can always resubscribe on our website.
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            If you didn't request this unsubscribe, please contact us immediately.
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          <p>© 2024 100AFRO. All rights reserved.</p>
        </div>
      </body>
    </html>
  );
};

export const UnsubscribeEmailText = () => {
  return `100AFRO Newsletter

We're sorry to see you go!

You've been successfully unsubscribed from the 100AFRO newsletter.

You will no longer receive emails from us. If you change your mind, you can always resubscribe on our website.

If you didn't request this unsubscribe, please contact us immediately.

© 2024 100AFRO. All rights reserved.`;
};
