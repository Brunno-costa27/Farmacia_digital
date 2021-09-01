import { http } from './config'

export default {

    user: null,
    listar:() => {
        return http.get('funcionario')
    },
    listar1:() => {
        return http.get('historico') // aqui é requisições que está no portal pacientes
        
    },
    salvar:(funcionario) => {
        return http.post('funcionario', funcionario)
    }
}