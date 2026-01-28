export const getConfirmationEmailHtml = (verificationUrl: string): string => {
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
      Thank you for subscribing to our newsletter! We're excited to have you join our community.
    </p>
    <p style="font-size: 16px; margin-bottom: 30px;">
      Please confirm your email address by clicking the button below:
    </p>
    <div style="text-align: center; margin-bottom: 30px;">
      <a
        href="${verificationUrl}"
        style="background-color: #10b981; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;"
      >
        Confirm Email Address
      </a>
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all;">
      ${verificationUrl}
    </p>
    <p style="font-size: 14px; color: #666; margin-top: 30px;">
      This link will expire in 24 hours.
    </p>
  </div>
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
    <p>If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
    <p style="margin-top: 10px;">© 2024 100AFRO. All rights reserved.</p>
  </div>
</body>
</html>
  `.trim();
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
