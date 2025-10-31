# Push Notifications Documentation

## Overview

The GodHouse application uses Expo Push Notification Service to send push notifications to iOS and Android devices. This system allows users to receive real-time notifications for events, sermons, payments, and reminders.

## Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Registering Push Tokens](#registering-push-tokens)
- [Notification Types](#notification-types)
- [Configuration](#configuration)
- [Scheduled Commands](#scheduled-commands)
- [Error Handling](#error-handling)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Architecture

### Components

1. **PushToken Model** - Stores device tokens for each user
2. **PushNotificationService** - Handles communication with Expo API
3. **PushTokenController** - API endpoints for token management
4. **SendEventReminders Command** - Scheduled job for event reminders
5. **Notification Triggers** - Various triggers throughout the application

### Flow Diagram

```
User Device → Expo Push Service → Laravel API → Expo API → User Device
     ↓                                              ↓
Register Token                              Send Notification
```

## Setup

### 1. Database Migration

Run the migration to create the `push_tokens` table:

```bash
php artisan migrate
```

### 2. Configuration

The push notification system uses the `config/notifications.php` configuration file. Default settings:

```php
'expo' => [
    'api_url' => 'https://exp.host/--/api/v2/push/send',
    'batch_size' => 100,
],
```

You can customize these settings via environment variables:

```env
EXPO_API_URL=https://exp.host/--/api/v2/push/send
EXPO_BATCH_SIZE=100
```

### 3. Scheduler Setup

Ensure Laravel's scheduler is running. Add to your crontab:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

This runs the event reminders command every minute.

## API Endpoints

All endpoints require authentication (`auth:sanctum` middleware).

### Get User's Push Tokens

```http
GET /api/v1/push-tokens
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Push tokens retrieved successfully",
    "data": [
        {
            "id": 1,
            "type": "push_token",
            "attributes": {
                "token": "ExponentPushToken[xxxxxxxxxxxxx]",
                "platform": "ios",
                "device_info": {
                    "device_name": "iPhone",
                    "os_version": "17.0"
                },
                "is_active": true
            },
            "meta": {
                "created_at": "2025-10-31T03:12:26.000000Z",
                "updated_at": "2025-10-31T03:12:26.000000Z"
            }
        }
    ]
}
```

### Register Push Token

```http
POST /api/v1/push-tokens
Authorization: Bearer {token}
Content-Type: application/json

{
    "token": "ExponentPushToken[xxxxxxxxxxxxx]",
    "platform": "ios",
    "device_info": {
        "device_name": "iPhone",
        "os_version": "17.0"
    }
}
```

**Request Body:**
- `token` (required, string) - The Expo push token from the device
- `platform` (required, enum) - Either `"ios"` or `"android"`
- `device_info` (optional, object) - Additional device information

**Response:**
```json
{
    "success": true,
    "message": "Push token registered successfully",
    "data": {
        "id": 1,
        "type": "push_token",
        "attributes": {
            "token": "ExponentPushToken[xxxxxxxxxxxxx]",
            "platform": "ios",
            "device_info": {
                "device_name": "iPhone",
                "os_version": "17.0"
            },
            "is_active": true
        },
        "meta": {
            "created_at": "2025-10-31T03:12:26.000000Z",
            "updated_at": "2025-10-31T03:12:26.000000Z"
        }
    }
}
```

**Notes:**
- If a token already exists for the user, it will be updated
- Multiple devices can register tokens for the same user
- Tokens are automatically marked as active

### Remove Push Token

```http
DELETE /api/v1/push-tokens/{id}
Authorization: Bearer {token}
```

**Response:**
```json
{
    "success": true,
    "message": "Push token removed successfully"
}
```

## Registering Push Tokens

### Client-Side Implementation (React Native/Expo)

```javascript
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

async function registerForPushNotificationsAsync() {
  let token;

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  // Get Expo push token
  token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig.extra.eas.projectId,
  });

  // Get platform
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';

  // Register with backend
  await fetch('https://your-api.com/api/v1/push-tokens', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token.data,
      platform: platform,
      device_info: {
        device_name: Device.modelName,
        os_version: Platform.Version.toString(),
      },
    }),
  });

  return token.data;
}
```

### Handle Token Updates

Update token on app launch and when user logs in:

```javascript
useEffect(() => {
  registerForPushNotificationsAsync();
}, []);
```

## Notification Types

The system automatically sends notifications for the following events:

### 1. Event Reminders

**Trigger:** Scheduled command runs every minute and checks for due reminders

**When Sent:**
- When `reminder_time` is reached
- Only if `is_sent = false`
- Within 5-minute grace period

**Notification Format:**
```json
{
    "title": "Event Reminder",
    "body": "Sunday Service is coming up on Nov 03, 2025 at 9:00 AM",
    "data": {
        "type": "event_reminder",
        "event_id": 1,
        "reminder_id": 1
    }
}
```

**How to Set a Reminder:**
```http
POST /api/v1/events/{id}/reminder
Authorization: Bearer {token}
Content-Type: application/json

{
    "reminder_time": "2025-11-03T08:30:00Z"
}
```

### 2. RSVP Confirmations

**Trigger:** Automatically when a user RSVPs to an event

**Notification Format:**
```json
{
    "title": "RSVP Confirmed",
    "body": "You're confirmed for Sunday Service on Nov 03, 2025 at 9:00 AM",
    "data": {
        "type": "event",
        "id": 1,
        "rsvp_id": 1
    }
}
```

**How to RSVP:**
```http
POST /api/v1/events/{id}/rsvp
Authorization: Bearer {token}
Content-Type: application/json

{
    "number_of_attendees": 2,
    "notes": "Bringing a guest"
}
```

### 3. Payment Confirmations

**Trigger:** Automatically when a payment is completed via Paystack webhook

**Notification Format for Book Purchase:**
```json
{
    "title": "Payment Confirmed",
    "body": "Your purchase of 'Book Title' has been confirmed",
    "data": {
        "type": "payment",
        "id": 1,
        "book_id": 1
    }
}
```

**Notification Format for Donation:**
```json
{
    "title": "Payment Confirmed",
    "body": "Your tithe of ₦5,000.00 has been processed successfully",
    "data": {
        "type": "payment",
        "id": 1,
        "donation_type": "tithe"
    }
}
```

### 4. New Sermon Notifications

**Trigger:** Automatically when a sermon is published (via SermonObserver)

**Notification Format:**
```json
{
    "title": "New Sermon Available",
    "body": "Walking in Faith - Pastor John Doe",
    "data": {
        "type": "sermon",
        "id": 1
    }
}
```

**Notes:**
- Sent to all users with active push tokens
- Only sent when sermon is first published or status changes from unpublished to published
- Sent via SermonObserver which listens to model events

## Configuration

### Environment Variables

```env
# Expo Push Notification API (optional, defaults provided)
EXPO_API_URL=https://exp.host/--/api/v2/push/send
EXPO_BATCH_SIZE=100
```

### Config File

Edit `config/notifications.php` to customize default settings:

```php
return [
    'expo' => [
        'api_url' => env('EXPO_API_URL', 'https://exp.host/--/api/v2/push/send'),
        'batch_size' => env('EXPO_BATCH_SIZE', 100),
    ],
    'defaults' => [
        'sound' => 'default',
        'priority' => 'default',
        'badge' => 1,
    ],
];
```

## Scheduled Commands

### Send Event Reminders

**Command:** `notifications:send-event-reminders`

**Schedule:** Every minute

**Purpose:** Checks for event reminders that are due and sends push notifications

**Manual Execution:**
```bash
php artisan notifications:send-event-reminders
```

**What It Does:**
1. Queries `EventReminder` where:
   - `is_sent = false`
   - `reminder_time <= now()`
   - `reminder_time >= now()->subMinutes(5)` (grace period)
2. Loads event and user information
3. Sends push notification via `PushNotificationService`
4. Marks reminder as sent (`is_sent = true`)

## Error Handling

### Invalid Tokens

The system automatically handles invalid tokens:

- **DeviceNotRegistered** - Token is removed from database
- **InvalidCredentials** - Token is marked as inactive
- Failed notifications are logged for debugging

### Logging

All notification failures are logged:

```php
Log::error('Failed to send notification', [
    'error' => $e->getMessage(),
    'user_id' => $user->id,
    'notification_type' => 'event_reminder',
]);
```

### Retry Logic

Currently, failed notifications are logged but not automatically retried. You can implement retry logic by:

1. Creating a queue job for notifications
2. Implementing retry logic in the job
3. Using Laravel's queue system for delayed retries

## Examples

### Example 1: Sending Manual Notification

```php
use App\Services\PushNotificationService;
use App\Models\User;

$pushService = app(PushNotificationService::class);
$user = User::find(1);

$pushService->sendToUser(
    $user,
    'Custom Notification',
    'This is a custom notification message',
    [
        'type' => 'custom',
        'custom_data' => 'value'
    ]
);
```

### Example 2: Sending to Multiple Users

```php
use App\Services\PushNotificationService;
use App\Models\User;

$pushService = app(PushNotificationService::class);
$users = User::whereHas('pushTokens')->get();

$pushService->sendToUsers(
    $users,
    'Announcement',
    'Important announcement for all users',
    [
        'type' => 'announcement'
    ]
);
```

### Example 3: Sending to Specific Tokens

```php
use App\Services\PushNotificationService;

$pushService = app(PushNotificationService::class);
$tokens = [
    'ExponentPushToken[token1]',
    'ExponentPushToken[token2]',
];

$pushService->sendNotification(
    $tokens,
    'Broadcast',
    'Broadcast message to specific devices',
    ['type' => 'broadcast']
);
```

## Troubleshooting

### Notifications Not Received

1. **Check Token Registration**
   ```http
   GET /api/v1/push-tokens
   ```
   Verify token exists and is active

2. **Check Expo Token Format**
   - Must start with `ExponentPushToken[`
   - Must end with `]`
   - Should be obtained from `expo-notifications` library

3. **Check Permissions**
   - iOS: User must grant notification permissions
   - Android: Permissions are granted automatically

4. **Check Scheduler**
   ```bash
   php artisan schedule:list
   ```
   Verify command is scheduled correctly

5. **Check Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```
   Look for notification errors

### Common Issues

**Issue: Token removed automatically**
- **Cause:** Invalid token returned from Expo
- **Solution:** Re-register token from device

**Issue: Notifications delayed**
- **Cause:** Scheduler not running
- **Solution:** Ensure cron job is configured

**Issue: Notifications not sent to all devices**
- **Cause:** Some tokens may be invalid
- **Solution:** Check logs for failed tokens

**Issue: Reminder not sent**
- **Cause:** Reminder time may have passed grace period
- **Solution:** Check reminder was created before the event time

## Best Practices

1. **Token Management**
   - Register token on app launch
   - Update token when user logs in
   - Remove token on logout or app uninstall

2. **Notification Frequency**
   - Don't spam users with notifications
   - Use notification preferences if implemented
   - Group related notifications when possible

3. **Testing**
   - Test with real devices
   - Test both iOS and Android
   - Test notification handling in app state (foreground, background, killed)

4. **Monitoring**
   - Monitor notification success rates
   - Track invalid token counts
   - Set up alerts for notification failures

## API Reference

### PushNotificationService Methods

#### `sendNotification(array $tokens, string $title, string $body, array $data = []): array`

Send notification to one or more tokens.

**Parameters:**
- `$tokens` - Array of Expo push tokens
- `$title` - Notification title
- `$body` - Notification body
- `$data` - Additional data payload

**Returns:** Array of results from Expo API

#### `sendToUser(User $user, string $title, string $body, array $data = []): array`

Send notification to all active tokens for a user.

**Parameters:**
- `$user` - User model instance
- `$title` - Notification title
- `$body` - Notification body
- `$data` - Additional data payload

**Returns:** Array of results from Expo API

#### `sendToUsers(Collection $users, string $title, string $body, array $data = []): array`

Send notification to multiple users.

**Parameters:**
- `$users` - Collection of User models
- `$title` - Notification title
- `$body` - Notification body
- `$data` - Additional data payload

**Returns:** Array of results from Expo API

## Additional Resources

- [Expo Push Notifications Documentation](https://docs.expo.dev/push-notifications/sending-notifications/)
- [Expo Push Notification API Reference](https://docs.expo.dev/push-notifications/sending-notifications-custom/)
- [Laravel Task Scheduling](https://laravel.com/docs/scheduling)

## Support

For issues or questions:
1. Check the logs: `storage/logs/laravel.log`
2. Review this documentation
3. Check Expo documentation for token issues
4. Contact the development team

---

**Last Updated:** October 31, 2025
**Version:** 1.0.0

