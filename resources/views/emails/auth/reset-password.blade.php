<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - GodHouse</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 20px 20px; background-color: #ff6b6b;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">GodHouse</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Reset Your Password</h2>

                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hello {{ $user->name }},
                            </p>

                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                You requested to reset your password for your GodHouse account. Please use the verification code below to reset your password.
                            </p>

                            <!-- Verification Code Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px; background-color: #fff5f5; border-radius: 8px; margin: 20px 0; border: 2px solid #ff6b6b;">
                                        <div style="font-size: 32px; font-weight: bold; color: #ff6b6b; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            {{ $code }}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 20px 0 0; text-align: center;">
                                This code will expire in 10 minutes.
                            </p>

                            <!-- Security Warning -->
                            <div style="background-color: #fff5f5; border-left: 4px solid #ff6b6b; padding: 15px; margin: 30px 0; border-radius: 4px;">
                                <p style="color: #d63031; font-size: 14px; line-height: 1.6; margin: 0;">
                                    <strong>⚠️ Security Warning:</strong> If you didn't request a password reset, please ignore this email and consider changing your password immediately.
                                </p>
                            </div>

                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
                                Thank you for using GodHouse.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                            <p style="color: #999999; font-size: 13px; margin: 0;">
                                © {{ date('Y') }} GodHouse. All rights reserved.
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 10px 0 0;">
                                This email was sent for your account security. Do not share this code with anyone.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
