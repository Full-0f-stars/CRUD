'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')

}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []// lendo o que tem no banco e envia para variavel client
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}


const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)

}

const readClient = () => getLocalStorage()


const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client) // adicionando com push o novo cliente
    setLocalStorage(dbClient)

}

const isValidFields = () => {
    return document.getElementById('formulario').reportValidity() //obrigando usuario a cadastrar tudo
}
// interação com o usuario

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveClient = () => {
    debugger
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
              updateTable()
            closeModal()
          
        }
    }
}

const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
<td>${client.nome}</td>
<td>${client.email}</td>
<td>${client.telefone}</td>
<td>${client.cidade}</td>
<td>
    <button type="button" class="button green" id="edit-${index}">editar</button>
    <button type="button" class="button red" id="delete-${index}">excluir</button>
</td>`

    document.querySelector('#tabela>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}


const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}
 const fillFileds = (client) => {
     document.getElementById('nome').value = client.nome
     document.getElementById('email').value = client.email
     document.getElementById('telefone').value = client.telefone
     document.getElementById('cidade').value = client.cidade
     document.getElementById('nome').dataset.index = client.index
 }
const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFileds(client)
    openModal()
}
const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}
updateTable()



document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)


document.getElementById('salvar')
    .addEventListener('click', saveClient)


document.querySelector('#tabela>tbody')
    .addEventListener('click', editDelete)