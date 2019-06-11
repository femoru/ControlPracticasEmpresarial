import axios from 'axios'

var instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': sessionStorage.getItem('token')
  }
})

export default instance;