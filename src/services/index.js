import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:5000/'
})

export default {
  search ({ query, perPage }) {
    return service.get('search', {
      params: {
        query,
        per_page: perPage || 20
      }
    })
  }
}
