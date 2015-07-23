<?php

namespace App\Http\Controllers;


use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\Source;
use Request;
use Session;

class ImportController extends Controller
{

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function index()
    {
        if (session()->has('sources')) {
            $sources = session('sources');
            return view('import/confirm', compact('sources'));
        }

        $formAction = [
            'method' => 'POST',
            'files' => true,
            'action' => ['ImportController@parse']
        ];
        return view('import/index', compact('formAction'));
    }

    /**
     * Parse xml and store in session.
     */
    public function parse()
    {
        $user = User::first();

        $file = Request::file('xml');
        if (!$file->isValid()) return redirect('/import')->withErrors(['msg', 'Invalid file!']);

        $xml = simplexml_load_file($file);
        if (!$xml) return redirect('/import')->withErrors(['msg', 'Invalid file!']);

        $items = $xml->body->outline;
        if (!$items || count($items) === 0) return redirect('/import')->withErrors(['msg', 'Invalid file!']);

        $this->findSources($items);

        return redirect('/import');
    }


    /**
     * Save resource in storage.
     */
    public function confirm()
    {
        $sources = Session::get('sources');
        if ($sources) {
            $user = User::first();
            $models = [];
            $user->sources()->createMany($sources);

            Session::forget('sources');
        }

        return redirect('/source');
    }




    /**
     * Parse OPML XML file (e.g. from innoreader) to myreqder's flat array of sources
     * @param  object $node   root node of the xml file
     * @param  string $folder [optional] source's folder name
     * @return array          sources' array
     */
    private function findSourcesRec($node, $folder = '')
    {
        $sources = [];
        if ($node->outline && count($node->outline) > 0) {
            $sources = $this->findSourcesRec($node->outline, trim($node['title']));
        }
        else {
            foreach ($node as $src) {
                $sources[] = [
                    'name' => trim($src['title']),
                    'url' => trim($src['xmlUrl']),
                    'real_url' => trim($src['htmlUrl']),
                    'folder' => $folder
                ];
            }
        }
        return $sources;
    }


    private function findSources($items)
    {
        $sources = $this->findSourcesRec($items);
        Session::set('sources', $sources);
    }

}
