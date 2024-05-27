<?php

namespace FinApp\DataFixture;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use FinApp\Model\OperationTypesStatic;
use FinApp\Model\User;
use FinApp\Model\Category;

class CategoryDataLoader implements FixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user1 = $manager->getRepository(User::class)->findOneBy(['username' => 'bohdan']);

        $category_exp1 = new Category($user1, 'Продукти', OperationTypesStatic::TYPE_EXPENSE);
        $category_exp2 = new Category($user1, 'Проїзд', OperationTypesStatic::TYPE_EXPENSE);
        $category_exp3 = new Category($user1, 'Обід', OperationTypesStatic::TYPE_EXPENSE);

        $category_inc1 = new Category($user1, 'Робота', OperationTypesStatic::TYPE_INCOME);
        $category_inc2 = new Category($user1, 'Фріланс', OperationTypesStatic::TYPE_INCOME);
        $category_inc3 = new Category($user1, 'Оренда', OperationTypesStatic::TYPE_INCOME);

        $manager->persist($category_exp1);
        $manager->persist($category_exp2);
        $manager->persist($category_exp3);
        $manager->persist($category_inc1);
        $manager->persist($category_inc2);
        $manager->persist($category_inc3);

        $manager->flush();
    }
}