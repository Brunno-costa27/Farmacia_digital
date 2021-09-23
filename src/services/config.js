import axios from 'axios';

export const http = axios.create({

    baseURL: 'http://pacienteweb.brazilsouth.cloudapp.azure.com:3333/'
})


