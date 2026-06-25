<?php

namespace App\Enum;

enum DataBridgeKeyEnum: string
{
    /**
     * Навешивание обработчиков событий
     */
    case JS_INIT_HANDLERS = 'js-init-handlers';
    /**
     * Инициализация на строне php
     */
    case PHP_INIT = 'php-init';

    function setValue(mixed $value): void
    {
        \dataBridge()->set($this->value, $value);
    }
}
