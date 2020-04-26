const http = require('http')
const https = require('https')

function requestHandler (req, res) {
  https
    .get(`https://unsplash.com/napi${req.url}`, resp => {
      let data = ''

      resp.on('data', chunk => (data += chunk))

      resp.on('end', () => {
        res.writeHead(resp.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        })

        res.end(data)
      })
    })
    .on('error', err => {
      console.log(err)
    })
}

http.createServer(requestHandler).listen(5000)
