import axios from 'axios'

const service = axios.create({
  baseURL: 'http://localhost:5000/'
})

export default {
  photo: ({ id }) => service.get(`photos/${id}`),

  search: ({ query, perPage, page }) => service.get('search/photos', {
    params: {
      query,
      page: page || 1,
      per_page: perPage || 20
    }
  })
}
