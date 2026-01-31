<?php

namespace App\Enums;

enum DonationType: string
{
    case Tithe = 'tithe';
    case Offering = 'offering';
    case Special = 'special';
    case Missions = 'missions';
}
