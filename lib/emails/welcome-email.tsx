export const getWelcomeEmailHtml = (): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; text-align: center;">
    <h1 style="color: #fff; margin-bottom: 20px;">Welcome to 100AFRO!</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-top: 20px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Your email has been confirmed! 🎉
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      You're now subscribed to the 100AFRO newsletter and will receive the latest updates about African entertainment, music, culture, and more.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      Get ready to discover:
    </p>
    <ul style="font-size: 16px; margin-bottom: 20px; padding-left: 20px;">
      <li>Latest Afrobeats hits and chart updates</li>
      <li>Exclusive artist interviews and features</li>
      <li>Breaking news from the African entertainment scene</li>
      <li>Trending topics and cultural insights</li>
    </ul>
    <p style="font-size: 16px; margin-top: 30px;">
      We're thrilled to have you as part of our community!
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p>© 2024 100AFRO. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
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
