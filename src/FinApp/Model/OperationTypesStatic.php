<?php

namespace FinApp\Model;

class OperationTypesStatic
{
    const TYPE_INCOME = 1;

    const TYPE_EXPENSE = 2;

    const TYPE_EXCHANGE = 3;

    static public function getList(): array
    {
        return [
            'income' => self::TYPE_INCOME,
            'expense' => self::TYPE_EXPENSE,
            'exchange' => self::TYPE_EXCHANGE,
        ];
    }

    static public function inList($value): bool
    {
        return in_array($value, self::getList());
    }
}