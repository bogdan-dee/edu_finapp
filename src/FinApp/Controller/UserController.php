<?php

declare(strict_types=1);

namespace FinApp\Controller;

use FinApp\Repository\UserRepository;
use FinApp\Service\JsonApiResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpNotFoundException;

final readonly class UserController
{
    public function __construct(private UserRepository $userRepository)
    {}

    public function usersAction(Request $request, Response $response): Response
    {
        $dataToDisplay = [];
        $allUsers = $this->userRepository->findAll();
        foreach ($allUsers as $user) {
            $dataToDisplay[] = $user->toArray();
        }

        $meta = ['count' => count($dataToDisplay)];

        $jsonResponseObj = new JsonApiResponse($meta, $dataToDisplay);
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function userAction(Request $request, Response $response, array $args): Response
    {
        $userId = (int) $args['id'];
        $user = $this->userRepository->findOneBy(['id' => $userId]);
        if (! $user) {
            throw new HttpNotFoundException($request, message: 'UserCard does not exist');
        }

        $jsonResponseObj = new JsonApiResponse(null, $user->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }
}