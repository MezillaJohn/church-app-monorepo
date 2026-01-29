<?php

namespace App\Traits;

trait ApiResponse
{
    protected function ok(string $message = 'Success', $data = [], int $code = 200)
    {
        if ($data instanceof \Illuminate\Http\Resources\Json\JsonResource && $data->resource instanceof \Illuminate\Pagination\AbstractPaginator) {
            $response = $data->response()->getData(true);

            return response()->json(array_merge([
                'success' => true,
                'message' => $message,
            ], $response), $code);
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message = 'Error', array $errors = [], int $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}

