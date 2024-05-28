<?php

namespace FinApp\Model;

use DateTimeImmutable;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OrderBy;
use Doctrine\ORM\Mapping\Table;
use Doctrine\Common\Collections\ArrayCollection;
use FinApp\Repository\UserRepository;

#[Entity(repositoryClass: UserRepository::class), Table(name: 'users')]
class User
{
    const string DATETIME_FORMAT_FOR_JSON = 'D M d Y H:i:s O';

    #[Id, Column(type: 'integer'), GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[Column(type: 'string', unique: true, nullable: false)]
    private string $username;

    #[Column(name: 'created_at', type: 'datetimetz_immutable', nullable: false)]
    private DateTimeImmutable $createdAt;

    #[Column(name: 'updated_at', type: 'datetimetz_immutable', nullable: false)]
    private DateTimeImmutable $updatedAt;

    #[OneToMany(targetEntity: Category::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    #[OrderBy(["id" => "ASC"])]
    private Collection $categories;

    #[OneToMany(targetEntity: Transaction::class, mappedBy: 'user')]
    #[OrderBy(["datetime" => "DESC"])]
    private Collection $transactions;

    public function __construct(string $username)
    {
        $this->username = $username;
        $this->updatedAt = $this->createdAt = new DateTimeImmutable('now');
        $this->categories = new ArrayCollection();
        $this->transactions = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function getTransactions(): Collection
    {
        return $this->transactions;
    }


    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'username' => $this->getUsername(),
            'categories_count' => $this->getCategories()->count(),
            'transactions_count' => $this->getTransactions()->count(),
            'created_at' => $this->getCreatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
            'updated_at' => $this->getUpdatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
        ];
    }
}