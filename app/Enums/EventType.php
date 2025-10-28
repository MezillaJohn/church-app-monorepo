<?php

namespace App\Enums;

enum EventType: string
{
    case Service = 'service';
    case Conference = 'conference';
    case Prayer = 'prayer';
    case Youth = 'youth';
    case Children = 'children';
}

