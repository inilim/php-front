<?php

namespace App\Example;

class AlertExample
{
    static function invoke(string $value): void
    {
        \window()->alert($value);
    }
}
