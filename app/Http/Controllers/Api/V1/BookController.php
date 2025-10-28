<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\BookPurchaseResource;
use App\Http\Resources\Api\V1\BookResource;
use App\Services\BookService;
use Illuminate\Http\Request;

class BookController extends BaseController
{
    public function __construct(private BookService $bookService)
    {
    }

    public function index(Request $request)
    {
        try {
            $books = $this->bookService->getAll($request->all());
            return $this->ok('Books retrieved successfully', BookResource::collection($books));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve books', ['exception' => $e->getMessage()], 500);
        }
    }

    public function show(int $id)
    {
        try {
            $book = $this->bookService->getById($id);

            if (!$book) {
                return $this->error('Book not found', [], 404);
            }

            return $this->ok('Book retrieved successfully', new BookResource($book));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve book', ['exception' => $e->getMessage()], 500);
        }
    }

    public function featured()
    {
        try {
            $books = $this->bookService->getFeatured();
            return $this->ok('Featured books retrieved successfully', BookResource::collection($books));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve featured books', ['exception' => $e->getMessage()], 500);
        }
    }

    public function myBooks(Request $request)
    {
        try {
            $purchases = $this->bookService->getPurchasedBooks($request->user());
            return $this->ok('My books retrieved successfully', BookPurchaseResource::collection($purchases));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve my books', ['exception' => $e->getMessage()], 500);
        }
    }

    public function checkPurchase(Request $request, int $id)
    {
        try {
            $hasPurchased = $this->bookService->checkIfPurchased($request->user(), $id);
            return $this->ok('Purchase status retrieved', ['purchased' => $hasPurchased]);
        } catch (\Exception $e) {
            return $this->error('Failed to check purchase status', ['exception' => $e->getMessage()], 500);
        }
    }
}
