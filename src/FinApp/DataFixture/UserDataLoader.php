<?php

namespace FinApp\DataFixture;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use FinApp\Model\User;

class UserDataLoader implements FixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user1 = new User('bohdan');
        $user2 = new User('mark');
        $user3 = new User('edwin');

        $manager->persist($user1);
        $manager->persist($user2);
        $manager->persist($user3);

        $manager->flush();
    }
}