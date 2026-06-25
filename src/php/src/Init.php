<?php

namespace App;

use App\ErrorHandle;
use App\InitException;
use App\Enum\DataBridgeKeyEnum;

final class Init
{
    function __invoke(): void
    {
        try {
            $this->process();
            DataBridgeKeyEnum::PHP_INIT->setValue(true);
            return;
        } catch (InitException $e) {
            \exceptionToConsole($e);
            \window()->alert(\sprintf('[%s] Для запуска приложения, не достают компоненты.', $e::class));
        } catch (\Throwable $e) {
            \exceptionToConsole($e);
            \window()->alert(\sprintf('[%s] Для запуска приложения, не достают компоненты.', $e::class));
        }

        DataBridgeKeyEnum::PHP_INIT->setValue(false);
    }

    protected function process(): void
    {
        \date_default_timezone_set('UTC');
        \ini_set('display_errors', 1);
        \error_reporting(\E_ALL);
        ini_set('memory_limit', '5m');
        (new ErrorHandle)->register();

        // Проверки:
        $this->checkDeps();
        // $this->checkEl();

        // Действия после проверок:

        // TODO
        \App\Example\AlertExample::invoke('Привет');

        return;

        // $html = '
        // <a>без атрибута</a>
        // <a href="">пустая</a>
        // <a href="/">главная</a>
        // <a href="/dawd">ссылка</a>
        // <a href="#">якорь</a>
        // <a href="https://github.com/notifications">внешний сайт</a>
        // ';
        // \contextApp()->add_raw_html_to_dom_service->setHtmlToFrame($html);

        // return;

        // Object.values(JSON.parse(JSON.stringify(window.__php_app.var.storage.ids)))

        // var_dump(\PHP_INT_MAX);
        // $intAsFloat = (float)'1769010624441';
        // var_dump($intAsFloat);
        // var_dump($intAsFloat + 1);
        // var_dump($intAsFloat * 2);
        // \var_dump((string)$intAsFloat);
        // var_dump(\PHP_FLOAT_MAX);

        // @INFO Полезно / как вариант можно js каллбеки вызывать из php
        // var_dump($fn); // object(Function)
        // $fn(12312312313);


        // @INFO Полезно
        // var_dump(\windowApp()->helper->typeof([])); // string(6) "object"
        // var_dump(\windowApp()->helper->typeof(new \stdClass)); // string(6) "object"
        // var_dump(\windowApp()->helper->typeof('string')); // string(6) "string"
        // var_dump(\windowApp()->helper->typeof(true)); // string(7) "boolean"
        // var_dump(\windowApp()->helper->typeof(123)); // string(6) "number"
        // var_dump(\windowApp()->helper->typeof(123.123)); // string(6) "number"
        // var_dump(\windowApp()->helper->typeof(null)); // string(6) "object"
    }

    /**
     * Наличие window JS обьектов
     */
    protected function checkDeps(): void
    {
        if (!\window()->__php_app) {
            throw new InitException('Class WindowPhpApp not found');
        }

        $w = \windowApp();
        $typeof = $w->helper->typeof(\window()->__php_app);
        if ($typeof !== 'object') {
            throw new InitException('Class WindowPhpApp not object');
        }
    }

    /**
     * Проверка наличия элементов
     */
    protected function checkEl(): void
    {
        $w = \windowApp();

        // $el = $w->helper->querySelector('[data-id="output"]');
        // if (!$el || \getVrznoType($el) !== 'HTMLPreElement') {
        //     throw new InitException('Element [data-id="output"] not found');
        // }
    }
}
