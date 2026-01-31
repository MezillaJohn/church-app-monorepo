<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Recurrence Expansion Months
    |--------------------------------------------------------------------------
    |
    | This value determines how far into the future recurring events should
    | be expanded into instances when viewing events. Default is 3 months.
    |
    */

    'recurrence_expansion_months' => env('EVENT_RECURRENCE_EXPANSION_MONTHS', 3),
];
