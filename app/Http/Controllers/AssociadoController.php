<?php

namespace App\Http\Controllers;

use App\Models\Associado;
use Illuminate\Http\Request;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AssociadoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Associado::select('id','título','descrição','imagem')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'título'=>'required',
            'descrição'=>'required',
            'imagem'=>'required|imagem'
        ]);

        try{
            $imageName = Str::random().'.'.$request->imagem->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('associado/imagem', $request->imagem,$imageName);
            Associado::create($request->post()+['imagem'=>$imageName]);

            return response()->json([
                'message'=>'Associado criado com sucesso!!'
            ]);
        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Ocorreu um erro ao criar um associado!!'
            ],500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Associado  $associado
     * @return \Illuminate\Http\Response
     */
    public function show(Associado $associado)
    {
        return response()->json([
            'associado'=>$associado
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Associado  $associado
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Associado $associado)
    {
        $request->validate([
            'título'=>'required',
            'descrição'=>'required',
            'imagem'=>'nullable'
        ]);

        try{

            $associado->fill($request->post())->update();

            if($request->hasFile('imagem')){

                // remover imagem antiga
                if($associado->imagem){
                    $exists = Storage::disk('public')->exists("associado/imagem/{$associado->imagem}");
                    if($exists){
                        Storage::disk('public')->delete("associado/imagem/{$associado->imagem}");
                    }
                }

                $imageName = Str::random().'.'.$request->imagem->getClientOriginalExtension();
                Storage::disk('public')->putFileAs('associado/imagem', $request->imagem,$imageName);
                $associado->imagem = $imageName;
                $associado->save();
            }

            return response()->json([
                'message'=>'Associado atualizado com sucesso!!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Ocorreu um erro ao atualizar o associado!!'
            ],500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Associado  $associado
     * @return \Illuminate\Http\Response
     */
    public function destroy(Associado $associado)
    {
        try {

            if($associado->imagem){
                $exists = Storage::disk('public')->exists("associado/imagem/{$associado->imagem}");
                if($exists){
                    Storage::disk('public')->delete("associado/imagem/{$associado->imagem}");
                }
            }

            $associado->delete();

            return response()->json([
                'message'=>'Associado apagado com sucesso!!'
            ]);
            
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Ocorreu um erro ao apagar o associado!!'
            ]);
        }
    }
}