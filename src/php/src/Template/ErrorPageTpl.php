<?php

namespace App\Template;

final class ErrorPageTpl
{
    static function invoke(): string
    {
        \ob_start();
?>
<!DOCTYPE html><html lang=ru><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;background:#f5f5f5;color:#333;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}.error-card{background:#fff;border:2px solid #333;max-width:500px;width:100%;padding:20px}h2{font-size:16px;text-transform:uppercase;margin-bottom:20px;font-weight:700}.status-badge{background:#d32f2f;color:#fff;padding:2px 6px;margin-right:8px}.data-block{margin-bottom:16px}.label{font-size:11px;text-transform:uppercase;color:#666;margin-bottom:4px}.value{background:#eee;border:1px solid #ccc;padding:8px;font-size:13px;word-break:break-all}.error{color:#d32f2f}a{display:block;text-align:center;margin-top:20px;padding:10px;border:2px solid #333;color:#333;text-decoration:none;text-transform:uppercase;font-size:13px;font-weight:700}a:hover{background:#333;color:#fff}</style><div class=error-card><h2><span class=status-badge>ERR</span>Сбой загрузки</h2><div class=data-block><div class=label>Target URL:</div><div class=value>{url}</div></div><div class=data-block><div class=label>Exception Log:</div><div class="value error">{message}</div></div><a data-load-try-again href={url}>Повторить попытку</a></div>
<?php
        return \ob_get_clean();
    }
}
