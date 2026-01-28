import React from 'react';

export const WelcomeEmail: React.FC = () => {
  return (
    <html>
      <body style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <div style={{ backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
          <h1 style={{ color: '#fff', marginBottom: '20px' }}>Welcome to 100AFRO!</h1>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', marginTop: '20px' }}>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Your email has been confirmed! 🎉
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            You're now subscribed to the 100AFRO newsletter and will receive the latest updates about African entertainment, music, culture, and more.
          </p>
          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Get ready to discover:
          </p>
          <ul style={{ fontSize: '16px', marginBottom: '20px', paddingLeft: '20px' }}>
            <li>Latest Afrobeats hits and chart updates</li>
            <li>Exclusive artist interviews and features</li>
            <li>Breaking news from the African entertainment scene</li>
            <li>Trending topics and cultural insights</li>
          </ul>
          <p style={{ fontSize: '16px', marginTop: '30px' }}>
            We're thrilled to have you as part of our community!
          </p>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#999' }}>
          <p>© 2024 100AFRO. All rights reserved.</p>
        </div>
      </body>
    </html>
  );
};

export const WelcomeEmailText = () => {
  return `Welcome to 100AFRO!

Your email has been confirmed! 🎉

You're now subscribed to the 100AFRO newsletter and will receive the latest updates about African entertainment, music, culture, and more.

Get ready to discover:
- Latest Afrobeats hits and chart updates
- Exclusive artist interviews and features
- Breaking news from the African entertainment scene
- Trending topics and cultural insights

We're thrilled to have you as part of our community!

© 2024 100AFRO. All rights reserved.`;
};
