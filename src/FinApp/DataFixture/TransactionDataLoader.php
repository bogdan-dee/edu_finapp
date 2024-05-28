<?php

namespace FinApp\DataFixture;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use FinApp\Model\Transaction;
use FinApp\Model\User;
use FinApp\Model\Category;

class TransactionDataLoader implements FixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $manager->getRepository(User::class)->findOneBy(['username' => 'Богдан']);
        $category1 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Фріланс']);
        $category2 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Робота']);
        $category3 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Інше']);


        $category5 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Комунальні платежі']);
        $category6 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Продукти']);
        $category7 = $manager->getRepository(Category::class)->findOneBy(['name' => 'Проїзд']);

        $transaction1 = new Transaction($user1, $category1, 500, 'розробка логотипу');
        $transaction2 = new Transaction($user1, $category1, 200, 'додаткові матеріали');
        $transaction3 = new Transaction($user1, $category2, 1000, 'зарплата');
        $transaction4 = new Transaction($user1, $category3, 100, 'повернення боргу');

        $transaction5 = new Transaction($user1, $category5, 250, 'електроенергія');
        $transaction6 = new Transaction($user1, $category6, 200, '');
        $transaction7 = new Transaction($user1, $category6, 150, 'смаколики');
        $transaction8 = new Transaction($user1, $category7, 50, 'таксі');
        $transaction9 = new Transaction($user1, $category3, 52, 'таксі');
        $transaction10 = new Transaction($user1, $category3, 100, 'потяг, квитки');

        $manager->persist($transaction1);
        $manager->persist($transaction2);
        $manager->persist($transaction3);
        $manager->persist($transaction4);
        $manager->persist($transaction5);
        $manager->persist($transaction6);
        $manager->persist($transaction7);
        $manager->persist($transaction8);
        $manager->persist($transaction9);
        $manager->persist($transaction10);

        $manager->flush();
    }
}