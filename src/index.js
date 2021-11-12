const express = require('express')
const { v4: uuidv4 } = require('uuid')

const app = express()

app.use(express.json());

const customers = [];

// Middlerare
function verifyIfExistsAccountCPF(request,response, next){
  const { cpf } = request.headers;

  //obs: diferente da função some() utilizada a cima, o find 
  //retorna o primeiro objeto encontrado
  const customer = customers.find((customer) => customer.cpf === cpf)

  if(!customer){
    return response.status(400).json({error: 'Customer not found'})
  }

   request.customer = customer
   return next()
}

function getBalance(statement) {
const balance =  statement.reduce((acc, operation)=> {
    if(operation.type === 'credit'){
      return acc + operation.amount
    }else {
      return acc - operation.amount;
    }
  },0)

  return balance


}

// Create account
app.post("/account", (request, response) => {
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
app.get('/statement',verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request

  return response.status(200).json(customer.statement)
});

// create deposit statement
app.post('/deposit',verifyIfExistsAccountCPF,(request, response) => {
  const { description, amount } = request.body;

  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit',
  }

  customer.statement.push(statementOperation);

  return response.status(201).json({sucess: 'Money deposited!'})
})

//create withdraw(saque) statement 
app.post('/withdraw',verifyIfExistsAccountCPF,(request, response) => {
  const { amount } = request.body
  const { customer} = request;
  
  const balance = getBalance(customer.statement)

  if(balance < amount){
    return response.status(400).json({error: 'Insufficent funds!'})
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  }

  customer.statement.push(statementOperation)

  return response.status(201).json({sucess: 'cash withdrawn'})
})

//statement list by day
app.get('/statement/:date',verifyIfExistsAccountCPF, (request, response) => {
  const { customer } = request
  const { date } = request.query;

  // formantando data para poder retornar todo o extrato do dia inteiro
  const dateFormat  = new Date(date + " 00:00");
   
  const statement = customer.statement.filter((statement)=> statement.created_at.toDateString() === 
  new Date(dateFormat).toDateString())

  if(statement.length > 0) {
    return response.status(200).json(statement)
  }

  return response.status(400).json({error: 'nao a transação nesse dia'})

});

app.listen(1000)