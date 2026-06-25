<?php

namespace Stub;

use PhpJsStub\Element;
use PhpJsStub\Function_;
use PhpJsStub\NodeList;

// WindowPhpHelper.ts
final readonly class WindowPhpHelper
{
    function jsonToJsValue(string $json): object
    {
        throw new \Error;
    }

    function createPhpInvoker(int $callbackId): Function_
    {
        throw new \Error;
    }

    function inspectValueToJson(mixed $value): string
    {
        return '';
    }

    function inspectValue(mixed $value): object
    {
        throw new \Error;
    }

    function isElement(mixed $value): bool
    {
        return true;
    }

    /**
     */
    function querySelector(string $selector): ?Element
    {
        throw new \Error;
    }

    function querySelectorAll(string $selector): NodeList
    {
        throw new \Error;
    }

    function compress(string $value): ?string
    {
        return '';
    }

    function decompress(string $value): ?string
    {
        throw new \Error;
    }

    // function extractTitleFromHtml(string $html): ?string
    // {
    //     throw new \Error;
    // }

    /**
     * @return "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
     */
    function typeof(mixed $value): string
    {
        return '';
    }

    function getNameClass(mixed $value): ?string
    {
        return '';
    }
}
