<?php

namespace FinApp\DTO;

class JsonApiResponseDTO
{
    public function __construct(
        public readonly array|null $meta = null,
        public readonly array|null $data = null,
        public readonly array|null $errors = null,
        public readonly string|null $api_version = null
    )
    {}

    public function toArray()
    {
        return (array) $this;
    }
}