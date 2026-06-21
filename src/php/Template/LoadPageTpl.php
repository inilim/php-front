<?php

namespace App\Template;

final class LoadPageTpl
{
    static function invoke(): string
    {
        \ob_start();
?>
        <div style="display:flex;align-items:center;justify-content:center;height:100%; background: #f4f6f8; color: #0f0; font-family: 'Courier New', Courier, monospace;">
            <style>
                .tui-loading {
                    font-size: 18px;
                    font-weight: bold;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                }

                /* ASCII Спиннер перед текстом */
                .tui-loading::before {
                    content: "[/]";
                    animation: tui-spin 1s steps(4) infinite;
                }

                /* Мигающий курсор после текста */
                .tui-loading::after {
                    content: "█";
                    animation: tui-blink 1s step-end infinite;
                    margin-left: 5px;
                    opacity: 0;
                }

                /* Анимация вращения символов */
                @keyframes tui-spin {
                    0% {
                        content: "[/]";
                    }

                    25% {
                        content: "[-]";
                    }

                    50% {
                        content: "[\\]";
                    }

                    /* Экранирование слэша */
                    75% {
                        content: "[|]";
                    }
                }

                /* Анимация курсора */
                @keyframes tui-blink {

                    0%,
                    100% {
                        opacity: 0;
                    }

                    50% {
                        opacity: 1;
                    }
                }
            </style>

            <p class="tui-loading">Load...</p>
        </div>
<?php
        return \ob_get_clean();
    }
}
