const express = require('express')

const app  = express()

app.get('/',(request,response)=> {
  return response.json({message:'hello word'})
})

app.listen(1000)