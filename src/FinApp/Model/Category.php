<?php

namespace FinApp\Model;

use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\OrderBy;
use Doctrine\ORM\Mapping\Table;
use FinApp\Repository\CategoryRepository;
use Doctrine\ORM\Mapping\UniqueConstraint;

#[Entity(repositoryClass: CategoryRepository::class), Table(name: 'categories')]
#[UniqueConstraint(name: 'category_unique_user_type_name', columns: ['user_id', 'type', 'name'])]
class Category
{
    const string DATETIME_FORMAT_FOR_JSON = 'D M d Y H:i:s O';

    #[Id, Column(type: Types::INTEGER), GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[ManyToOne(targetEntity: User::class, inversedBy: 'categories')]
    #[JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false)]
    private User $user;

    #[Column(type: Types::STRING, nullable: false)]
    private string $name;

    #[Column(type: Types::INTEGER, nullable: false)]
    private string $type;

    #[OneToMany(targetEntity: Transaction::class, mappedBy: 'category',cascade: ['persist', 'remove'])]
    #[OrderBy(["datetime" => "DESC"])]
    private Collection $transactions;

    #[Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $createdAt;

    #[Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $updatedAt;

    public function __construct(User $user, string $name, int $type)
    {
        $this->setName($name);
        $this->setUser($user);
        $this->setType($type);
        $this->updatedAt = $this->createdAt = new DateTimeImmutable('now');
        $this->transactions = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): Category
    {
        $this->user = $user;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): Category
    {
        $this->name = trim($name);

        return $this;
    }

    public function getType(): int
    {
        return $this->type;
    }

    public function setType(int $type): Category
    {
        $this->type = $type;

        return $this;
    }

    public function getCreatedAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(): Category
    {
        $this->updatedAt = new DateTimeImmutable('now');

        return $this;
    }

    public function getTransactions(): Collection
    {
        return $this->transactions;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'name' => $this->getName(),
            'type' => $this->getType(),
            'transactions_count' => $this->getTransactions()->count(),
            'created_at' => $this->getCreatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
            'updated_at' => $this->getUpdatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
        ];
    }
}