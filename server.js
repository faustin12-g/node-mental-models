import express from 'express'
import fs, { read } from 'fs'
import { randomUUID } from 'crypto'
import { json } from 'stream/consumers'


const app = express()

app.use(express.json())

const FILE_PATH = './data.json'

function readFile()
{
    if(!fs.existsSync(FILE_PATH))
    {
        fs.writeFileSync(FILE_PATH, '[]')
    }
    const fileContent = fs.readFileSync(FILE_PATH, 'utf8')
    return JSON.parse(fileContent)
}

function writeFile(data)
{
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))
}

app.get('/items', (req, res)=>{
    const items = readFile()

    res.status(200).json(items)
})



app.post('/items', (req, res)=>{
    const items = readFile()

    const newItem = {
        id: randomUUID(),
        ...req.body
    }

    items.push(newItem)
    writeFile(items)
    return res.status(201).json({message: 'data created'})
})

app.put('/item/:id',(req, res)=>{
    const items = readFile()

    const index = items.findIndex(item=> item.id === req.params.id)

    items[index] = {...items[index], ...req.body}
    writeFile(items)
    res.status(200).json(items)
})

app.delete('/item/:id', (req, res)=>{
    const items = readFile()
    const updated = items.filter(item => item.id !== req.params.id)
    writeFile(updated)
    res.status(200).json({message: 'deleted'})
})



app.listen(3000,()=>{
    console.log('Server is running on the 3000 port');
});

