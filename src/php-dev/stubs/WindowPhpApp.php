<?php

namespace Stub;

use Stub\WindowPhpHelper;
use Stub\DataBridge;
use Stub\WindowPhpActionService;

// WindowPhpApp.ts
final readonly class WindowPhpApp
{
    public DataBridge $data_bridge;
    public WindowPhpHelper $helper;
    public WindowPhpActionService $action;
}
