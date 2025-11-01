<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verification Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

    </style>
</head>
<body>
    <p>Hello {{ $name }},</p>
    <p>Your verification code is:</p>
    <h2 style="letter-spacing:4px;">{{ $code }}</h2>
    <p>This code expires in a few minutes. If you didn't request this, you can ignore this email.</p>
    <p>Thanks,<br>GodHouse</p>
</body>
</html>
