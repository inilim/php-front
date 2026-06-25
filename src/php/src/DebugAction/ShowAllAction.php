<?php

namespace App\DebugAction;

/**
 */
class ShowAllAction
{
    function __invoke(): void
    {
        $output = \get_var_dump(\dataBridge()->getAll());
        \console()->info('DataBridge: ', $output);

        $output = \get_var_dump(\contextApp()->callback_registry->count());
        \console()->info('CallbackRegistryService: ', $output);
    }
}
