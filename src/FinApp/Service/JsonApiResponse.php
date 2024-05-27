<?php

namespace FinApp\Service;

use FinApp\DTO\JsonApiResponseDTO;

class JsonApiResponse
{
    const string CURRENT_API_VERSION = '1.0';

    public function __construct(private $meta = null, private $data = null, private $exception = null)
    {

    }

    public function setMeta($meta)
    {
        $this->meta = $meta;

        return $this;
    }

    public function setData($data)
    {
        $this->data = $data;

        return $this;
    }

    public function setException($exception)
    {
        $this->exception = $exception;

        return $this;
    }

    public function generateResponse()
    {
        $DTOArray = $this->createDTO()->toArray();
        $filteredDTOObject = array_filter($DTOArray, fn($value) => !is_null($value) && $value !== '');

        return json_encode($filteredDTOObject);
    }

    private function createDTO(): JsonApiResponseDTO
    {
        $DTO = new JsonApiResponseDTO($this->meta, $this->data, $this->exception, $this::CURRENT_API_VERSION);

        return $DTO;
    }
}