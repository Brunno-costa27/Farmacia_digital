import { http } from './config'

export default {

    listar:() => {
        return http.get('funcionario')
    },
    listar1:() => {
        return http.get('historico')
    }
}