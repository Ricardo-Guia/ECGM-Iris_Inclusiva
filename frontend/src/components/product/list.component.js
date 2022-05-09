import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Swal from 'sweetalert2'

export default function List() {

    const [associados, setAssociados] = useState([])

    useEffect(()=>{
        fetchAssociados() 
    },[])

    const fetchAssociados = async () => {
        await axios.get(`http://localhost:8000/api/associados`).then(({data})=>{
            setAssociados(data)
        })
    }

    const deleteAssociado = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Tem a certeza?',
            text: "Não vai ser possível reverter isto!",
            icon: 'aviso',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, apagar!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }

          await axios.delete(`http://localhost:8000/api/associados/${id}`).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchAssociados()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }

    return (
      <div className="container">
          <div className="row">
            <div className='col-12'>
                <Link className='btn btn-primary mb-2 float-end' to={"/associado/create"}>
                    Criar associado
                </Link>
            </div>
            <div className="col-12">
                <div className="card card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0 text-center">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Descrição</th>
                                    <th>Imagem</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    associados.length > 0 && (
                                        associados.map((row, key)=>(
                                            <tr key={key}>
                                                <td>{row.title}</td>
                                                <td>{row.description}</td>
                                                <td>
                                                    <img width="50px" src={`http://localhost:8000/storage/associados/imagem/${row.image}`} />
                                                </td>
                                                <td>
                                                    <Link to={`/associado/edit/${row.id}`} className='btn btn-success me-2'>
                                                        Editar
                                                    </Link>
                                                    <Button variant="danger" onClick={()=>deleteAssociado(row.id)}>
                                                        Apagar
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}