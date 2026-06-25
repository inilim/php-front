<?php

namespace App;

use Inilim\Tool\Obj;
use Inilim\Tool\Other;
use Inilim\Tool\Time;

final class ErrorHandle
{
    function register(): void
    {
        \set_error_handler($this->handleError(...));
        \set_exception_handler($this->handleException(...));
        \register_shutdown_function($this->shutdown(...));
    }

    // ------------------------------------------------------------------
    // 
    // ------------------------------------------------------------------

    protected function shutdown(): void
    {
        // @INFO set_error_handler не обрабатывает ряд ошибок, и происходит обрыв выполнения скрипта, но register_shutdown_function отрабатывает...

        // echo __METHOD__;
        $err = \error_get_last();
        if (!$err) {
            return;
        }

        $log = [
            'shutdown_ms' => Time::unixMsAsFloat(),
            'err' => $err,
        ];

        $this->logger('SHUTDOWN', $log);
    }

    /**
     * @param integer $level_err
     * @param string $message
     * @param string $file
     * @param integer $line
     * @return bool
     */
    protected function handleError($level_err, $message, $file, $line)
    {
        $t = [
            'error_reporting' => $t = \error_reporting(),
            'level_err'       => $level_err,
            '@suppress'       => !($t & $level_err),
            'message'         => $message,
            'file'            => $file,
            'line'            => $line,
            'ms'              => Time::unixMsAsFloat(),
        ];

        if ($t['@suppress']) {
            $this->logger('@suppress', $t);
            return true;
        }

        if (\in_array($level_err, [\E_DEPRECATED, \E_USER_DEPRECATED], true)) {
            $this->logger('E_DEPRECATED', $t);
        } elseif ($level_err === \E_NOTICE) {
            $this->logger('E_NOTICE', $t);
        } else {
            $this->logger('Error', [
                $message,
                $file,
                $line
            ]);
            throw Obj::rewriteLocationException(new \Error($message), $file, $line);
        }

        // Не запускаем внутренний обработчик ошибок PHP
        return true;
    }

    /**
     * @param \Throwable $e
     */
    protected function handleException($e): void
    {
        $arr = Other::getExceptionDetails($e);
        $this->logger('EXCEPTION', $arr);
        throw $e;
    }

    protected function logger(string $name, array $data): void
    {
        $data = [
            'LOG' => $data,
            'INFO' => [
                'NAME_TRIGGER' => $name,
            ],
        ];
        // echo 'er:1';
        \console()->error(\get_var_dump($data));
    }
}
