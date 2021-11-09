const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json());

const customers = [];

app.post("/account", (request,response)=> {
 const { cpf, name } = request.body;

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
app.listen(1000)