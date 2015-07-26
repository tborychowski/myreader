<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $dates = ['published_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'url', 'content', 'is_unread', 'is_starred', 'published_at'];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = ['user_id', 'created_at', 'updated_at'];


    // todo Article::unread()
    public function scopeUnread ($query)
    {
        $query->where('is_unread', '=', 1);
    }

    // todo Article::unread()
    public function scopeStarred ($query)
    {
        $query->where('is_starred', '=', 1);
    }


    public function user()
    {
        return $this->belongTo('App\User');
    }


    public function source()
    {
        return $this->belongTo('App\Source');
    }



}
