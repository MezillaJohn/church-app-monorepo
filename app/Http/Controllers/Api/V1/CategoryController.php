<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Controller as BaseController;
use App\Http\Resources\Api\V1\CategoryResource;
use App\Models\Category;

class CategoryController extends BaseController
{
    /**
     * Get all sermon categories
     */
    public function getSermonCategories()
    {
        try {
            $categories = Category::where('type', 'sermon')
                ->where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            return $this->ok('Sermon categories retrieved successfully', CategoryResource::collection($categories));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve sermon categories', ['exception' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all book categories
     */
    public function getBookCategories()
    {
        try {
            $categories = Category::where('type', 'book')
                ->where('is_active', true)
                ->orderBy('name', 'asc')
                ->get();

            return $this->ok('Book categories retrieved successfully', CategoryResource::collection($categories));
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve book categories', ['exception' => $e->getMessage()], 500);
        }
    }
}
