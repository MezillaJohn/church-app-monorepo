# Push Notifications for Sermon and Book Uploads

## Overview
Push notifications are now automatically sent to all users when an admin uploads a new sermon or book.

## Implementation Details

### How It Works

1. **Model Observers**
   - `SermonObserver` - Monitors sermon creation and updates
   - `BookObserver` - Monitors book creation and updates

2. **Trigger Conditions**
   
   **Sermons:**
   - When a new sermon is created with media (audio or video) and is published
   - When an existing sermon is updated to add media and is published
   
   **Books:**
   - When a new book is created and is published
   - When an existing book is updated to be published

3. **Notification Jobs**
   - `ProcessNewSermonNotifications` - Handles sermon notifications
   - `ProcessNewBookNotifications` - Handles book notifications
   
   Both jobs:
   - Process users in chunks of 100 for optimal performance
   - Create database notifications for in-app display
   - Send push notifications to users' devices via Expo

4. **Push Notification Service**
   - Uses `PushNotificationService` to send notifications via Expo Push API
   - Automatically handles token batching (max 100 per request)
   - Removes invalid/expired tokens automatically
   - Logs all notification attempts for debugging

### Notification Content

**Sermon Notifications:**
- Title: "New Sermon Available"
- Body: [Sermon Title]
- Data: sermon_id, type, action_url

**Book Notifications:**
- Title: "New Book Available"
- Body: [Book Title]
- Data: book_id, type, action_url

## Technical Architecture

```
Admin uploads Sermon/Book
         ↓
Model Observer detects change
         ↓
Dispatches notification job to queue
         ↓
Job processes users in chunks
         ↓
For each chunk:
  1. Create database notifications
  2. Send push notifications via PushNotificationService
         ↓
PushNotificationService sends to Expo API
         ↓
Expo delivers to user devices
```

## Queue Processing

The application uses the `database` queue driver. To process notifications:

```bash
# Start the queue worker
php artisan queue:work

# Or use Supervisor in production for automatic restart
```

## Files Modified

1. `/app/Jobs/ProcessNewSermonNotifications.php`
   - Added `PushNotificationService` injection
   - Added push notification sending logic

2. `/app/Jobs/ProcessNewBookNotifications.php`
   - Added `PushNotificationService` injection
   - Added push notification sending logic

## Testing

To test the functionality:

1. **Manual Testing:**
   ```bash
   # Start queue worker
   php artisan queue:work
   
   # In another terminal, create a sermon via Filament admin panel
   # Check that notifications are sent
   ```

2. **Check Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

## Important Notes

- **Queue Worker:** Ensure the queue worker is running in production
- **Expo Tokens:** Users must have registered push tokens in the `push_tokens` table
- **Performance:** Jobs process users in chunks to avoid memory issues
- **Error Handling:** Invalid tokens are automatically removed from the database
- **Published Status:** Only published sermons/books trigger notifications

## Configuration

Push notification settings are in `config/notifications.php`:
- `expo.api_url` - Expo Push API endpoint
- `expo.batch_size` - Maximum tokens per batch (default: 100)

## Troubleshooting

**Notifications not sending?**
1. Check queue worker is running: `php artisan queue:work`
2. Check users have active push tokens: `SELECT * FROM push_tokens WHERE is_active = 1`
3. Check job was dispatched: `SELECT * FROM jobs`
4. Check logs: `tail -f storage/logs/laravel.log`

**Push notifications not received on devices?**
1. Verify Expo tokens are valid
2. Check Expo Push API response in logs
3. Ensure app has notification permissions on device
