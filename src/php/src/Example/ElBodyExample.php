<?php

namespace App\Example;

class ElBodyExample
{
    static function invoke(): void
    {
        $doc = &\window()->document;
        $myElement = $doc->createElement('div');
        $myElement->textContent = 'Hello, World!';
        $myElement->className = 'my-style';
        $doc->body->append($myElement);
    }
}
