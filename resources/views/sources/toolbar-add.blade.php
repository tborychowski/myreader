@if ($delFormAction)
    {!! Form::open($delFormAction) !!}
        <button type="submit" class="btn btn-right" title="Delete source">
            {{-- <i class="fa fa-trash"></i> --}}
            <i class="icon ion-ios-trash-outline"></i>
        </button>
    {!! Form::close() !!}
@endif

<a class="btn" href="{{ url('source ') }}">
    {{-- <i class="fa fa-arrow-left"></i> --}}
    <i class="icon ion-ios-arrow-left"></i>
</a>

<h1 class="title">{{ $delFormAction ? 'Edit source' : 'Add new source' }}</h1>
