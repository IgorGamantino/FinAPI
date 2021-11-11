const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json());

const customers = [];

// Create account
app.post("/account", (request,response) => {
 const { cpf, name } = request.body;

 //obs: o some() é um funçao que busca no array e retorna true ou false
  const customerAlreadyExistes = customers.some((customer) => customer.cpf === cpf)

  if(customerAlreadyExistes) {
    return response.status(400).json({error: 'Account already Exists'})
  }

 customers.push({
   cpf,
   name,
   id: uuidv4(),
   statement: []
 });

 return response.status(201).json({sucess: 'Account created successfully' })

});

// Get statement user
app.get('/statement',(request,response) => {
  const { cpf } = request.headers;

  //obs: diferente da função some() utilizada a cima, o find 
  //retorna o primeiro objeto encontrado
  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer){
    return response.status(400).json({error: 'Customer not found'})
  }

  return response.status(200).json(customer.statement)
})


app.listen(1000)