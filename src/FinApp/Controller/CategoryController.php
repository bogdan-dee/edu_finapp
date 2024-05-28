<?php

declare(strict_types=1);

namespace FinApp\Controller;

use Doctrine\ORM\EntityManager;
use FinApp\Model\Category;
use FinApp\Model\OperationTypesStatic;
use FinApp\Model\User;
use FinApp\Repository\CategoryRepository;
use FinApp\Repository\UserRepository;
use FinApp\Service\JsonApiResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;

final readonly class CategoryController
{
    private CategoryRepository $categoryRepository;
    private UserRepository $userRepository;

    public function __construct(private EntityManager $entityManager)
    {
        $this->categoryRepository = $this->entityManager->getRepository(Category::class);
        $this->userRepository = $this->entityManager->getRepository(User::class);
    }

    public function getCategoriesAction(Request $request, Response $response): Response
    {
        $user = $this->findUser($request);
        $dataToDisplay = [];
        $categories = $this->categoryRepository->findBy(['user' => $user->getId()], ['id' => 'ASC']);
        foreach ($categories as $category) {
            $dataToDisplay[] = $category->toArray();
        }

        $meta = ['count' => count($dataToDisplay)];

        $jsonResponseObj = new JsonApiResponse($meta, $dataToDisplay);
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function getCategoryAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);
        $categoryId = (int) $args['id'];
        $category = $this->categoryRepository->findOneBy(['id' => $categoryId]);
        if (! $category || $category->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Category does not exist');
        }

        $jsonResponseObj = new JsonApiResponse(null, $category->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function postCategoryAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);

        // form validation
        $body = $request->getParsedBody();
        if (! OperationTypesStatic::inList($body['type'])) {
            throw new HttpBadRequestException($request, 'Unknown operation type for category');
        }

        $newCategory = new Category(
            $user,
            $body['name'],
            (int) $body['type']
        );
        $this->entityManager->persist($newCategory);
        $this->entityManager->flush();
        $meta = ['inserted' => 1];

        $jsonResponseObj = new JsonApiResponse($meta, $newCategory->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response->withStatus(201);
    }

    public function putCategoryAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);
        $categoryId = (int) $args['id'];
        /** @var Category $category */
        $category = $this->categoryRepository->findOneBy(['id' => $categoryId]);
        if (! $category || $category->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Category does not exist');
        }

        // form validation
        $body = $request->getParsedBody();
        if (! OperationTypesStatic::inList($body['type'])) {
            throw new HttpBadRequestException($request, 'Unknown operation type for category');
        }

        // writing the changes
        $meta = ['updated' => 0];
        $categoryOriginal = clone $category;
        $category
            ->setName($body['name'])
            ->setType((int) $body['type']);

        if ($category->toArray() !== $categoryOriginal->toArray()) {
            $category->setUpdatedAt();
            $this->entityManager->flush();
            $this->entityManager->clear();
            $meta['updated'] = 1;
        }

        // preparing response
        $jsonResponseObj = new JsonApiResponse($meta, $category->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function deleteCategoryAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);
        $categoryId = (int) $args['id'];
        /** @var Category $category */
        $category = $this->categoryRepository->findOneBy(['id' => $categoryId]);
        if (! $category || $category->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Category does not exist');
        }
        $countTransactionsToBeDeleted = $category->getTransactions()->count();

        // writing the changes
        $this->entityManager->remove($category);
        $this->entityManager->flush();
        $meta = [
            'deleted' => 1,
            'deleted_transactions' => $countTransactionsToBeDeleted
        ];

        // preparing response
        $jsonResponseObj = new JsonApiResponse($meta);
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    private function findUser($request)
    {
        $userId = (int) $request->getQueryParams()['user_id'] ?? 0;
        $user = $this->userRepository->findOneBy(['id' => $userId]);
        if (! $user) {
            throw new HttpNotFoundException($request, message: 'User does not exist');
        }

        return $user;
    }
}