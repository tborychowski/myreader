<?php

namespace App\Http\Controllers;


use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\User;
use App\Source;
use Request;
use Session;

class SourceViewController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $user = User::first();
        $sources = $user->sources()->get();

        $this->forgetImportedSources();

        return view('sources/sources', compact('sources'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $source = User::first()->sources()->find($id);
        return view('sources/source', compact('source'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        $source = new Source;
        $formAction = ['method' => 'POST', 'action' => ['SourceViewController@store']];
        $delFormAction = null;
        return view('sources/source', compact('source', 'formAction', 'delFormAction'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $source = User::first()->sources()->find($id);
        $formAction = ['method' => 'PATCH', 'action' => ['SourceViewController@update', $source->id]];
        $delFormAction = [
            'method' => 'DELETE',
            'action' => ['SourceViewController@destroy', $source->id],
            'onSubmit' => 'return confirm("Are you sure?")'
        ];
        return view('sources/source', compact('source', 'formAction', 'delFormAction'));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        $user = User::first();
        $user->sources()->create(Request::all());
        return redirect('/source');
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        $source = Source::findOrFail($id);
        $source->update(Request::all());
        return redirect('/source');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        $source = Source::findOrFail($id);
        $source->delete();
        return redirect('/source');
    }



    /*** IMPORT ***********************************************************************************/

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function import()
    {
        $formAction = [
            'method' => 'POST',
            'files' => true,
            'action' => ['SourceViewController@parseImport']
        ];
        return view('sources/import', compact('formAction'));
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
        Session::set('source_names', array_map(function ($s) { return $s['name']; }, $sources));
    }

    private function forgetImportedSources ()
    {
        Session::forget('sources');
        Session::forget('source_names');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function parseImport()
    {
        $user = User::first();

        $file = Request::file('xml');
        if (!$file->isValid()) return redirect('/source/import')->withErrors(['msg', 'Invalid file!']);

        $xml = simplexml_load_file($file);
        if (!$xml) return redirect('/source/import')->withErrors(['msg', 'Invalid file!']);

        $items = $xml->body->outline;
        if (!$items || count($items) === 0) return redirect('/source/import')->withErrors(['msg', 'Invalid file!']);

        $this->findSources($items);

        return redirect('/source/import');
    }


    public function confirmImport()
    {
        $sources = Session::get('sources');
        if ($sources) {
            $user = User::first();
            $models = [];
            $user->sources()->createMany($sources);
        }
        $this->forgetImportedSources();

        return redirect('/source');
    }

}
