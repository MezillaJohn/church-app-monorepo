<?php

return [
    'code_length' => env('VERIFICATION_CODE_LENGTH', 4),
    'code_ttl_minutes' => env('VERIFICATION_CODE_TTL_MINUTES', 15),
    'max_attempts' => env('VERIFICATION_MAX_ATTEMPTS', 5),
    'resend_cooldown_seconds' => env('VERIFICATION_RESEND_COOLDOWN_SECONDS', 60),
    'proceed_token_ttl_minutes' => env('VERIFICATION_PROCEED_TOKEN_TTL_MINUTES', 15),
];
