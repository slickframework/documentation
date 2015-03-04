<?php

/**
 * This file is part of the ApiGen (http://apigen.org)
 *
 * For the full copyright and license information, please view
 * the file license.md that was distributed with this source code.
 */

require('apigen.phar');

require __DIR__ . '/bootstrap.php';



$tempDir = sys_get_temp_dir() . '/_apigen.temp';
ApiGen\FileSystem\FileSystem::purgeDir($tempDir);



Tracy\Debugger::$strictMode = TRUE;
if (isset($_SERVER['argv']) && ($tmp = array_search('--debug', $_SERVER['argv'], TRUE))) {
    Tracy\Debugger::enable(Tracy\Debugger::DEVELOPMENT);
    define('LOG_DIRECTORY', __DIR__ . '/../apigen-log/');

} else {
    Tracy\Debugger::enable(Tracy\Debugger::PRODUCTION);
    Tracy\Debugger::$onFatalError[] = function() {
        echo "For more information turn on the debug mode using the --debug option.\n";
    };
}



setlocale(LC_ALL, 'C');
if ( ! ini_get('date.timezone')) {
    date_default_timezone_set('UTC');
}


define('APIGEN_ROOT_PATH', __DIR__);


$configurator = new Nette\Configurator;
$configurator->setDebugMode( ! Tracy\Debugger::$productionMode);
$configurator->setTempDirectory($tempDir);
$configurator->addConfig(__DIR__ . '/ApiGen/DI/config.neon');
$container = $configurator->createContainer();

$configurator->


//$application = $container->getByType('ApiGen\Console\Application');
