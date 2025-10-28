<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Enums\EventType;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Annual Church Conference 2025',
                'description' => 'Join us for three days of worship, teaching, and fellowship. This year\'s theme is "Walking in Faith" with special guest speakers and powerful sessions.',
                'event_type' => EventType::Conference,
                'location' => 'Main Church Auditorium, 123 Church Street, City, State',
                'event_date' => now()->addDays(60),
                'event_time' => '09:00:00',
                'max_attendees' => 500,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Youth Retreat 2025',
                'description' => 'A weekend retreat for our youth group focusing on spiritual growth, team building, and worship. Ages 13-25 are welcome.',
                'event_type' => EventType::Youth,
                'location' => 'Camp Victory, 456 Mountain Road, Countryside',
                'event_date' => now()->addDays(45),
                'event_time' => '17:00:00',
                'max_attendees' => 150,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Bible Study Workshop',
                'description' => 'Learn effective methods for studying the Bible with practical tools and techniques to deepen your understanding of Scripture.',
                'event_type' => EventType::Service,
                'location' => 'Church Library, 123 Church Street, City, State',
                'event_date' => now()->addDays(30),
                'event_time' => '19:00:00',
                'max_attendees' => 50,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Community Outreach Day',
                'description' => 'Join us in serving our local community through various outreach activities including food distribution, prayer, and fellowship.',
                'event_type' => EventType::Prayer,
                'location' => 'Community Center, 789 Main Street, Downtown',
                'event_date' => now()->addDays(90),
                'event_time' => '10:00:00',
                'max_attendees' => 100,
                'requires_rsvp' => false,
            ],
            [
                'title' => 'Marriage Enrichment Seminar',
                'description' => 'A practical seminar for couples to strengthen their marriage through biblical principles, communication, and understanding God\'s design for relationships.',
                'event_type' => EventType::Service,
                'location' => 'Main Church Auditorium, 123 Church Street, City, State',
                'event_date' => now()->addDays(75),
                'event_time' => '14:00:00',
                'max_attendees' => 200,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Leadership Training Workshop',
                'description' => 'Equip yourself with essential leadership skills based on biblical principles. Perfect for current and aspiring leaders in the church.',
                'event_type' => EventType::Service,
                'location' => 'Church Annex Building, 123 Church Street, City, State',
                'event_date' => now()->addDays(120),
                'event_time' => '18:30:00',
                'max_attendees' => 60,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Men\'s Prayer Breakfast',
                'description' => 'Monthly gathering for men to pray together, share, and build stronger relationships with God and each other.',
                'event_type' => EventType::Prayer,
                'location' => 'Church Fellowship Hall, 123 Church Street, City, State',
                'event_date' => now()->addDays(15),
                'event_time' => '07:00:00',
                'max_attendees' => 80,
                'requires_rsvp' => false,
            ],
            [
                'title' => 'Women\'s Day Conference',
                'description' => 'A special day dedicated to women featuring inspiring speakers, workshops, and worship. Theme: "Victorious Living".',
                'event_type' => EventType::Conference,
                'location' => 'Main Church Auditorium, 123 Church Street, City, State',
                'event_date' => now()->addDays(105),
                'event_time' => '09:00:00',
                'max_attendees' => 300,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Financial Stewardship Seminar',
                'description' => 'Learn biblical principles for managing finances, budgeting, and becoming a faithful steward of God\'s resources.',
                'event_type' => EventType::Service,
                'location' => 'Church Annex Building, 123 Church Street, City, State',
                'event_date' => now()->addDays(90),
                'event_time' => '15:00:00',
                'max_attendees' => 100,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Christmas Carol Service',
                'description' => 'Join us for a beautiful evening of Christmas carols, readings, and celebration of the birth of our Savior, Jesus Christ.',
                'event_type' => EventType::Prayer,
                'location' => 'Main Church Auditorium, 123 Church Street, City, State',
                'event_date' => now()->addDays(345),
                'event_time' => '19:00:00',
                'max_attendees' => 400,
                'requires_rsvp' => false,
            ],
            [
                'title' => 'Discipleship Training Program',
                'description' => 'An intensive program to train and equip disciples to make disciples, following the Great Commission.',
                'event_type' => EventType::Service,
                'location' => 'Church Library, 123 Church Street, City, State',
                'event_date' => now()->addDays(180),
                'event_time' => '17:00:00',
                'max_attendees' => 70,
                'requires_rsvp' => true,
            ],
            [
                'title' => 'Easter Celebration Service',
                'description' => 'A joyous celebration of the resurrection of Jesus Christ with powerful worship, testimonies, and a special message of hope.',
                'event_type' => EventType::Conference,
                'location' => 'Main Church Auditorium, 123 Church Street, City, State',
                'event_date' => now()->addDays(160),
                'event_time' => '10:00:00',
                'max_attendees' => 600,
                'requires_rsvp' => false,
            ],
        ];

        foreach ($events as $eventData) {
            Event::create([
                'title' => $eventData['title'],
                'description' => $eventData['description'],
                'event_type' => $eventData['event_type'],
                'location' => $eventData['location'],
                'event_date' => $eventData['event_date'],
                'event_time' => $eventData['event_time'],
                'image_url' => 'events/' . str_replace(' ', '-', strtolower($eventData['title'])) . '.jpg',
                'max_attendees' => $eventData['max_attendees'],
                'requires_rsvp' => $eventData['requires_rsvp'],
                'is_published' => true,
            ]);
        }
    }
}
