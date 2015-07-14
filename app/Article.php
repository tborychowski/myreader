<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $dates = ['published_at'];


    public function user()
    {
        return $this->belongTo('App\User');
    }


    public function source()
    {
        return $this->belongTo('App\Source');
    }



}
