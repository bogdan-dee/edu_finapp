<?php

declare(strict_types=1);

namespace FinApp\Controller;

use FinApp\Service\JsonApiResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;

class ApiController
{
    public function homeAction(Request $request, Response $response): Response
    {
        $meta = ['welcome_message' => 'The API welcomes you with a good 200 OK response :)'];
        $jsonResponseObj = new JsonApiResponse($meta);
        $json = $jsonResponseObj->generateResponse();
        $response->getBody()->write($json);

        return $response;
    }
}