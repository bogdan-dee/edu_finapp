<?php

return [
    'settings' => [
        'slim' => [
            'dev_mode' => filter_var($_ENV['DEV_MODE'], FILTER_VALIDATE_BOOL),

            // Returns a detailed HTML page with error details and
            // a stack trace. Should be disabled in production.
            'displayErrorDetails' => filter_var($_ENV['SLIM_DISPLAY_ERROR_DETAILS'], FILTER_VALIDATE_BOOL),

            // Whether to display errors on the internal PHP log or not.
            'logErrors' => filter_var($_ENV['SLIM_LOG_ERRORS'], FILTER_VALIDATE_BOOL),

            // If true, display full errors with message and stack trace on the PHP log.
            // If false, display only "Slim Application Error" on the PHP log.
            // Doesn't do anything when 'logErrors' is false.
            'logErrorDetails' => filter_var($_ENV['SLIM_LOG_ERROR_DETAILS'], FILTER_VALIDATE_BOOL),
        ],

        'doctrine' => [
            // Enables or disables Doctrine metadata caching
            // for either performance or convenience during development.
            'dev_mode' => filter_var($_ENV['DEV_MODE'], FILTER_VALIDATE_BOOL),

            // Path where Doctrine will cache the processed metadata
            // when 'dev_mode' is false.
            'cache_dir' => APP_ROOT . '/cache/doctrine',

            // List of paths where Doctrine will search for metadata.
            // Metadata can be either YML/XML files or PHP classes annotated
            // with comments or PHP8 attributes.
            'metadata_dirs' => [APP_ROOT . '/src/FinApp/Model'],

            // The parameters Doctrine needs to connect to your database.
            // These parameters depend on the driver (for instance the 'pdo_sqlite' driver
            // needs a 'path' parameter and doesn't use most of the ones shown in this example).
            // Refer to the Doctrine documentation to see the full list
            // of valid parameters: https://www.doctrine-project.org/projects/doctrine-dbal/en/current/reference/configuration.html
            'connection' => [
                'driver' => $_ENV['DOCTRINE_DRIVER'],
                'host' => $_ENV['MYSQL_HOST'],
                'port' => $_ENV['MYSQL_PORT'],
                'dbname' => $_ENV['MYSQL_DATABASE'],
                'user' => $_ENV['MYSQL_USER'],
                'password' => $_ENV['MYSQL_PASSWORD'],
                'charset' => $_ENV['DOCTRINE_CHARSET']
            ]
        ]
    ]
];