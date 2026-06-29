import express from 'express'
import fs from 'fs'
import { randomUUID } from 'crypto'


const app = express()
app.use(express.json())

const FILE_PATH = './data.json'


function readData()
{
    if(!fs.existsSync(FILE_PATH))
    {
        fs.readFileSync(FILE_PATH, 'utf8')
    }
    const fileContent = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(fileContent)
}

function writeData(data)
{
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))
}

app.listen(3000, ()=>{
    console.log('server is listening to http://localhost:3000')
    
})


app.get('/items', (req, res)=>{
    const items = readData();
    res.status(200).json(items)
})


app.post('/items', (req, res)=>{
    const items = readData()
    const newItem = {
        id: randomUUID(),
        ...req.body
    }
    items.push(newItem);

    writeData(items)
    res.status(201).json(newItem)
})


app.put('/item/:id', (req, res)=>{
    const items = readData()

    const index = items.findIndex(item=> item.id === req.params.id);
    if(index === -1)
    {
        return res.status(404).json({message: 'Item not found'})
    }
    items[index] = { ...items[index], ...req.body}
    writeData(items)
    res.status(200).json(items[index])
})


app.delete('/item/:id', (req, res)=>{
    const items = readData();

    const index = items.findIndex(item=> item.id === req.params.id);
    if(index === -1)
    {
        return res.status(404).json({message: 'Item not found'})
    }
    const updatedItems = items.filter(item=> item.id !== req.params.id)
    writeData(updatedItems)
    return res.status(200).json({message: 'Item deleted successfully'});
});
