<?php

namespace App\Example;

class AddEventExample
{
    static function invoke(): void
    {
        $jsFn = \contextApp()->callback_registry->getJsCallback(static function ($event) {
            \console()->log('click', $event);
        }, once: false);

        \window()->document->body->addEventListener('click', $jsFn);
    }
}
