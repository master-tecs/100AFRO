export const getUnsubscribeEmailHtml = (): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #1a1a1a; padding: 30px; border-radius: 8px; text-align: center;">
    <h1 style="color: #fff; margin-bottom: 20px;">100AFRO Newsletter</h1>
  </div>
  <div style="background-color: #fff; padding: 30px; border-radius: 8px; margin-top: 20px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      We're sorry to see you go!
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      You've been successfully unsubscribed from the 100AFRO newsletter.
    </p>
    <p style="font-size: 16px; margin-bottom: 20px;">
      You will no longer receive emails from us. If you change your mind, you can always resubscribe on our website.
    </p>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      If you didn't request this unsubscribe, please contact us immediately.
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p>© 2024 100AFRO. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
};

export const UnsubscribeEmailText = () => {
  return `100AFRO Newsletter

We're sorry to see you go!

You've been successfully unsubscribed from the 100AFRO newsletter.

You will no longer receive emails from us. If you change your mind, you can always resubscribe on our website.

If you didn't request this unsubscribe, please contact us immediately.

© 2024 100AFRO. All rights reserved.`;
};
