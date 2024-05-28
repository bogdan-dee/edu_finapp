<?php

namespace FinApp\DataFixture;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Persistence\ObjectManager;
use FinApp\Model\User;

class UserDataLoader implements FixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $user1 = new User('Користувач 1');
        $user2 = new User('Користувач 2');
        $user3 = new User('Користувач 3');
        $user4 = new User('Богдан');
        $user5 = new User('sandbox');

        $manager->persist($user1);
        $manager->persist($user2);
        $manager->persist($user3);
        $manager->persist($user4);
        $manager->persist($user5);

        $manager->flush();
    }
}