<?php

namespace App;

use App\Service\CallbackRegistryService;

/**
 * Тут хранить синглтоны
 */
final class ContextApp
{
    protected static self $instance;

    protected function __construct(
        // public readonly TabLS $tab_ls = new TabLS,
        public readonly CallbackRegistryService $callback_registry = new CallbackRegistryService,
    ) {}

    static function self(): self
    {
        if (isset(self::$instance)) {
            return self::$instance;
        }

        self::$instance = new self;
        return self::$instance;
    }
}
