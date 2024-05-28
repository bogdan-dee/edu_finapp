<?php

declare(strict_types=1);

namespace FinApp\Controller;

use Doctrine\ORM\EntityManager;
use FinApp\Model\Category;
use FinApp\Model\Transaction;
use FinApp\Model\User;
use FinApp\Repository\TransactionRepository;
use FinApp\Repository\UserRepository;
use FinApp\Repository\CategoryRepository;
use FinApp\Service\JsonApiResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpNotFoundException;
use Doctrine\DBAL\Types\Types;

final readonly class TransactionController
{
    private TransactionRepository $transactionRepository;
    private UserRepository $userRepository;
    private CategoryRepository $categoryRepository;

    public function __construct(private EntityManager $entityManager)
    {
        $this->transactionRepository = $this->entityManager->getRepository(Transaction::class);
        $this->userRepository = $this->entityManager->getRepository(User::class);
        $this->categoryRepository = $this->entityManager->getRepository(Category::class);
    }

    public function getTransactionsAction(Request $request, Response $response): Response
    {
        $user = $this->findUser($request);
        $startEndTimes = $this->getStartEndTimeForQuery($request);
        $dataToDisplay = [];

        $queryBuilder = $this->entityManager->createQueryBuilder();
        $query = $queryBuilder
            ->select('t')
            ->from(Transaction::class, 't')
            ->where($queryBuilder->expr()->andX(
                $queryBuilder->expr()->eq('t.user', ':user'),
                $queryBuilder->expr()->between('t.datetime', ':start_time', ':end_time')
            ))
            ->orderBy('t.datetime', 'DESC')
            ->setParameter('user', $user)
            ->setParameter('start_time', $startEndTimes[0]->setTimezone($startEndTimes[3]), Types::DATETIMETZ_IMMUTABLE)
            ->setParameter('end_time', $startEndTimes[1]->setTimezone($startEndTimes[3]), Types::DATETIMETZ_IMMUTABLE)
            ->getQuery();
        $transactions = $query->getResult();
        foreach ($transactions as $transaction) {
            $dataToDisplay[] = $transaction->toArray();
        }
        $meta = ['count' => count($dataToDisplay)];

        $jsonResponseObj = new JsonApiResponse($meta, $dataToDisplay);
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function getTransactionAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);

        $transactionId = (int) $args['id'];
        $transaction = $this->transactionRepository->findOneBy(['id' => $transactionId]);
        if (! $transaction || $transaction->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Transaction does not exist');
        }

        $jsonResponseObj = new JsonApiResponse(null, $transaction->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function postTransactionAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);

        // form validation
        $body = $request->getParsedBody();

        $categoryId = (int) $body['category'] ?? 0;
        $category = $this->categoryRepository->findOneBy(['id' => $categoryId]);
        if (! $category || $category->getUser()->getId() !== $user->getId()) {
            throw new HttpBadRequestException($request, message: 'Category does not exist');
        }

        $amountMin = 0.1;
        $amountMax = 10 ** 9; // 1 bill
        $amount = (float) $body['amount'];
        if ($amount < $amountMin || $amount > $amountMax) {
            throw new HttpBadRequestException($request, message: 'Provided amount value is out of range');
        }

        // validate and build optional field for transaction datetime
        $UTCDatetime = null;
        $datetime = (! empty($body['datetime'])) ? $body['datetime'] : null;
        if ($datetime !== null) {
            if (empty($body['timezone'])) {
                throw new HttpBadRequestException($request, message: 'Client timezone is not provided');
            }

            try {
                $timezone = new \DateTimeZone($body['timezone']);
                $datetime = new \DateTimeImmutable($datetime, $timezone);
                $UTCDatetime = $datetime->setTimezone(new \DateTimeZone(date_default_timezone_get()));
            } catch (\Exception $error) {
                throw new HttpBadRequestException($request, message: 'Datetime or timezone values are invalid');
            }
        }
        // end of form validation

        $newTransaction = new Transaction(
            $user,
            $category,
            $amount,
            $body['description']
        );
        if ($UTCDatetime !== null) {
            $newTransaction->setDatetime($UTCDatetime);
        }
        $this->entityManager->persist($newTransaction);
        $this->entityManager->flush();
        $meta = ['inserted' => 1];

        $jsonResponseObj = new JsonApiResponse($meta, $newTransaction->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response->withStatus(201);
    }

    public function putTransactionAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);

        $transactionId = (int) $args['id'];
        /** @var Transaction $transaction */
        $transaction = $this->transactionRepository->findOneBy(['id' => $transactionId]);
        if (! $transaction || $transaction->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Transaction does not exist');
        }

        // form validation
        $body = $request->getParsedBody();

        $categoryId = (int) $body['category'] ?? 0;
        $category = $this->categoryRepository->findOneBy(['id' => $categoryId]);
        if (! $category || $category->getUser()->getId() !== $user->getId()) {
            throw new HttpBadRequestException($request, message: 'Category does not exist');
        }

        $amountMin = 0.1;
        $amountMax = 10 ** 9; // 1 bill
        $amount = (float) $body['amount'];
        if ($amount < $amountMin || $amount > $amountMax) {
            throw new HttpBadRequestException($request, message: 'Provided amount value is out of range');
        }

        // validate and build optional field for transaction datetime
        $datetime = (! empty($body['datetime'])) ? $body['datetime'] : null;
        $timezone = (! empty($body['timezone'])) ? $body['timezone'] : null;
        if ($datetime && $timezone) {
            try {
                $timezone = new \DateTimeZone($body['timezone']);
                $datetime = new \DateTimeImmutable($datetime, $timezone);
                $UTCDatetime = $datetime->setTimezone(new \DateTimeZone(date_default_timezone_get()));
            } catch (\Exception $error) {
                throw new HttpBadRequestException($request, message: 'Datetime or timezone values are invalid');
            }
        } else {
            throw new HttpBadRequestException($request, message: 'Datetime or timezone values are missing');
        }
        // end of form validation


        // writing the changes
        $meta = ['updated' => 0];
        $transactionOriginal = clone $transaction;
        $transaction
            ->setCategory($category)
            ->setAmount($amount)
            ->setDescription($body['description'])
            ->setDatetime($UTCDatetime);

        if ($transaction->toArray() !== $transactionOriginal->toArray()) {
            $transaction->setUpdatedAt();
            $this->entityManager->flush();
            $this->entityManager->clear();
            $meta['updated'] = 1;
        }

        // preparing response
        $jsonResponseObj = new JsonApiResponse($meta, $transaction->toArray());
        $response->getBody()->write($jsonResponseObj->generateResponse());

        return $response;
    }

    public function deleteTransactionAction(Request $request, Response $response, array $args): Response
    {
        $user = $this->findUser($request);
        $transactionId = (int) $args['id'];
        /** @var Transaction $transaction */
        $transaction = $this->transactionRepository->findOneBy(['id' => $transactionId]);
        if (! $transaction || $transaction->getUser()->getId() !== $user->getId()) {
            throw new HttpNotFoundException($request, message: 'Transaction does not exist');
        }

        // writing the changes
        $this->entityManager->remove($transaction);
        $this->entityManager->flush();
        $meta = ['deleted' => 1];

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

    private function getStartEndTimeForQuery($request): array
    {
        $clientTimeZone = $request->getQueryParams()['timezone'] ?? date_default_timezone_get();
        try {
            $timezone = new \DateTimeZone($clientTimeZone);
        } catch (\Exception $error) {
            $timezone = new \DateTimeZone(date_default_timezone_get());
        }
        $UTCTimezone = new \DateTimeZone(date_default_timezone_get());

        $availableDateFilters = [
            'today',
            'yesterday',
            'this_week',
            'last_week',
            'this_month',
            'last_month'
        ];
        $dateFilter = $request->getQueryParams()['date_filter'] ?? '';
        if (! in_array($dateFilter, $availableDateFilters)) {
            $dateFilter = $availableDateFilters[0];
        }

        switch ($dateFilter) {
            case 'yesterday':
                $startTime = new \DateTimeImmutable('yesterday', $timezone);
                $today = new \DateTimeImmutable('today', $timezone);
                $endTime = $today->modify('-1 second');
                break;
            case 'this_week':
                $startTime = new \DateTimeImmutable('Monday this week', $timezone);
                $endTime = new \DateTimeImmutable('now', $timezone);
                break;
            case 'last_week':
                $startTime = new \DateTimeImmutable('Monday last week', $timezone);
                $mondayThisWeek = new \DateTimeImmutable('Monday this week', $timezone);
                $endTime = $mondayThisWeek->modify('-1 second');
                break;
            case 'this_month':
                $startTime = new \DateTimeImmutable('first day of this month midnight', $timezone);
                $endTime = new \DateTimeImmutable('now', $timezone);
                break;
            case 'last_month':
                $startTime = new \DateTimeImmutable('first day of last month midnight', $timezone);
                $firstDayOfThisMonth = new \DateTimeImmutable('first day of this month midnight', $timezone);
                $endTime = $firstDayOfThisMonth->modify('-1 second');
                break;
            default:
                $startTime = new \DateTimeImmutable('today', $timezone);
                $endTime = new \DateTimeImmutable('now', $timezone);
                break;
        }

        return [$startTime, $endTime, $timezone, $UTCTimezone];
    }
}