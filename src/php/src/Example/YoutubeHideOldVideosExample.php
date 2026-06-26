<?php

namespace App\Example;

class YoutubeHideOldVideosExample
{
    static function invoke(): void
    {
        $service = \contextApp()->callback_registry;

        $fnEach = $service->getJsCallback(static function ($node = null) {
            if ($node === null) return;

            \console()->log('PHP', $node);
        }, once: false);

        $fn = $service->getJsCallback(static function () use (&$fnEach) {

            \console()->log('PHP', 'interval start');

            // $videoItems = $doc->querySelectorAll('ytd-rich-item-renderer:not([data-checked-age])');
            $videoItems = \window()->document->querySelectorAll('ytd-rich-item-renderer');
            /** @var \PhpJsStub\NodeList $videoItems */

            $videoItems->forEach($fnEach);

            \console()->log('PHP', 'interval end');
            // 
        }, once: false);

        \window()->setInterval($fn, 2000);

        // \contextApp()->callback_registry->removeByName('interval');



        // \console()->log('PHP', $videoItems->length);

    }
}
