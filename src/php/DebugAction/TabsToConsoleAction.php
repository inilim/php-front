<?php

namespace App\DebugAction;

/**
 */
class TabsToConsoleAction
{
    function __invoke(): void
    {
        foreach (\contextApp()->tab_collection_service->getAll() as $tab) {
            $print = \get_var_dump($tab);
            // \console()->log(\print_r($tab, true));
            \console()->log($print);
        }
    }
}
