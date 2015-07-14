<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'folder', 'url', 'real_url', 'icon', 'last_error'];


    public function user()
    {
        return $this->belongTo('App\User');
    }


    public function articles ()
    {
        return $this->hasMany('App\Article');
    }

}
