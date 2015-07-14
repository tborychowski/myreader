<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{


    public function user()
    {
        return $this->belongTo('App\User');
    }


    public function articles ()
    {
        return $this->hasMany('App\Article');
    }

}
