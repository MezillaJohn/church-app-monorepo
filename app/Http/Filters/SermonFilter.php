<?php

namespace App\Http\Filters;

class SermonFilter extends QueryFilter
{
    public function include($value)
    {
        // Ensure $value is an array
        $includes = is_array($value) ? $value : explode(',', $value);

        return $this->builder->with($includes);
    }

    public function type($value)
    {
        return $this->builder->where('type', $value);
    }

    public function categoryId($value)
    {
        return $this->builder->where('category_id', $value);
    }

    public function series($value)
    {
        return $this->builder->where('series', 'like', '%'.$value.'%');
    }
}
