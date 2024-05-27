<?php

declare(strict_types=1);

use DI\Container;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use Doctrine\DBAL\DriverManager;

const APP_ROOT = __DIR__;

require_once __DIR__ . '/vendor/autoload.php';
$settings = require_once __DIR__ . '/config/settings.php';

if (filter_var($settings['settings']['slim']['dev_mode'],FILTER_VALIDATE_BOOL) === true) {
    require_once __DIR__ . '/config/devtools.php';
}

$container = new Container($settings);

/**
 * Configure Doctrine and EntityManager as a service.
 */
$container->set(EntityManager::class, static function (Container $c): EntityManager {
    /** @var array $settings */
    $settings = $c->get('settings')['doctrine'];

    // Create a simple "default" Doctrine ORM configuration for Attributes
    $config = ORMSetup::createAttributeMetadataConfiguration(
        paths: $settings['metadata_dirs'],
        isDevMode: $settings['dev_mode'],
    );

    // configuring the database connection
    $connection = DriverManager::getConnection($settings['connection'], $config);

    return new EntityManager($connection, $config);
});

return $container;
