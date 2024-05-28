<?php

namespace FinApp\Model;

use DateTimeImmutable;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\Id;
use Doctrine\ORM\Mapping\Index;
use Doctrine\ORM\Mapping\JoinColumn;
use Doctrine\ORM\Mapping\ManyToOne;
use Doctrine\ORM\Mapping\Table;
use FinApp\Repository\TransactionRepository;

#[Entity(repositoryClass: TransactionRepository::class), Table(name: 'transactions')]
#[Index(name: 'index_datetime',columns: ['datetime'])]
class Transaction
{
    const string DATETIME_FORMAT_FOR_JSON = 'D M d Y H:i:s O';

    #[Id, Column(type: Types::INTEGER), GeneratedValue(strategy: 'AUTO')]
    private int $id;

    #[ManyToOne(targetEntity: User::class, inversedBy: 'transactions')]
    #[JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false)]
    private User $user;

    #[ManyToOne(targetEntity: Category::class, inversedBy: 'transactions')]
    #[JoinColumn(name: 'category_id', referencedColumnName: 'id', nullable: false)]
    private Category $category;

    #[Column(type: Types::INTEGER, nullable: false)]
    private string $type;

    #[Column(type: Types::FLOAT, nullable: false)]
    private float $amount;

    #[Column(type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $datetime;

    #[Column(type: Types::TEXT)]
    private string $description;

    #[Column(name: 'created_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $createdAt;

    #[Column(name: 'updated_at', type: Types::DATETIMETZ_IMMUTABLE, nullable: false)]
    private DateTimeImmutable $updatedAt;

    public function __construct(User $user, Category $category, float $amount, string $description = '')
    {
        $this->setUser($user)
            ->setCategory($category)
            ->setAmount($amount)
            ->setDescription($description)
            ->setDatetime(new DateTimeImmutable('now'));

        $this->updatedAt = $this->createdAt = $this->getDatetime();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    public function setUser(User $user): Transaction
    {
        $this->user = $user;

        return $this;
    }


    public function getCategory(): Category
    {
        return $this->category;
    }

    public function setCategory(Category $category): Transaction
    {
        $this->category = $category;
        $this->setType();

        return $this;
    }

    public function getType(): int
    {
        return $this->type;
    }

    public function setType(): Transaction
    {
        $this->type = $this->getCategory()->getType();

        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): Transaction
    {
        $this->amount = $amount;

        return $this;
    }

    public function getDatetime(): DateTimeImmutable
    {
        return $this->datetime;
    }

    public function setDatetime(DateTimeImmutable $datetime): Transaction
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): Transaction
    {
        $this->description = trim($description);

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

    public function setUpdatedAt(): Transaction
    {
        $this->updatedAt = new DateTimeImmutable('now');

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->getId(),
            'user_id' => $this->getUser()->getId(),
            'category' => $this->getCategory()->getId(),
            'category_name' => $this->getCategory()->getName(),
            'type' => $this->getType(),
            'amount' => $this->getAmount(),
            'datetime' => $this->getDatetime()->format(self::DATETIME_FORMAT_FOR_JSON),
            'description' => $this->getDescription(),
            'created_at' => $this->getCreatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
            'updated_at' => $this->getUpdatedAt()->format(self::DATETIME_FORMAT_FOR_JSON),
        ];
    }
}