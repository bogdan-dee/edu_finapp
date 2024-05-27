<?php

namespace FinApp\DataFixture;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use FinApp\Model\OperationTypesStatic;
use FinApp\Model\Transaction;
use FinApp\Model\User;
use FinApp\Model\Category;

class TransactionDataLoader implements FixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $manager->getRepository(User::class)->findOneBy(['username' => 'bohdan']);
        $category1 = $user1->getCategories()->first();
        $category2 = $user1->getCategories()->last();

        $transaction1 = new Transaction($user1, $category1, 10.50, 'testing description');
        $transaction2 = new Transaction($user1, $category2, 100);

        $manager->persist($transaction1);
        $manager->persist($transaction2);

        $manager->flush();
    }
}