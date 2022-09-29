import express, { json } from 'express'

const app = express()
const { Router } = express
const router = Router()


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`)
})

server.on("error", error => console.log(`Error en servidor ${error}`))



app.use(json())
app.use(express.urlencoded({ extended: true }))
//defino lugar donde se van a poder ver los archivos 
// app.use('/public', express.static(__dirname + '/public'));
//un middleware de prueba

app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});

app.use('/api/productos', router)

//FAKER
import { faker } from '@faker-js/faker';
faker.locale = 'es'

//

let productos = [ {
    title: "Escuadra",
    price: 123.45,
    thumbnail: "http://localhost:8080/public/tato.jpg",
    id: 1
  },
  {
    title: "Calculadora",
    price: 234.56,
    thumbnail: "http://localhost:8080/public/tato.jpg",
    id: 2
  },
  {
    title: "Globo Terráqueo",
    price: 345.67,
    thumbnail: "http://localhost:8080/public/tato.jpg",
    id: 3
  }
 ]

//clase

class Products {
  constructor(products){
  this.products = [...products];
  }

  getAll(){
    return this.products;
  }

  findOne(id){
  return this.products.find((item)=>item.id == id)
  }

  addOne(product){
    const lastItem = this.products[this.products.length - 1]
    let lastId = 1;
    if (lastItem){
      lastId = lastItem.id + 1;
    }
    product.id = lastId
    this.products.push(product)
    return this.products[this.products.length - 1];
  }
  updateOne(id, product){
    const productInsert = {...product, id}

    for (let i=0; i< this.products.length; i++){
      if(this.products[i].id == id){
        this.products[i] = productInsert;
        return productInsert;
      }
    }
    return undefined;
  }

  deleteOne(id){
    const encontrarProducto = this.findOne(id);
    if(encontrarProducto){
      this.products = this.products.filter((item)=> item.id != id)
      return id;
    }
    return undefined;
  }




}

import ProductsFake from './mocks/generadorProductos.js'


//MOSTRAR FORMULARIO

app.get('/form', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

//agrega el producto cargado en el formulario
router.post('/', (req, res) => {
  const {body} = req;
  console.log(body)
  body.price = parseFloat(body.price);
  const products = new Products(productos)
  const productoGenerado = products.addOne(body);
  res.json({sucess: "ok", new: productoGenerado})
})

//muestra todos los productos
router.get("/", (req, res) => {
    const products = new Products (productos)
    res.json(products.getAll())
})


//TEST MOCKS
router.get('/test', async (req, res) => {
    const products = new ProductsFake()
   try {
       res.json(await products.generarFakeProducts())
   } catch (err) {
       next(err)
   }
})



//GET CON ID IDENTIFICADOR EN LA URL TIPO PARAMS
router.get('/:id', (req, res) => {
    let { id } = req.params;
    const products = new Products(productos)
    id = parseInt(id)

    const encontrar = products.findOne(id)
    if (encontrar){
        res.json(encontrar)
    }else{
    res.json({error: "producto no encontrado"})
    }
  });

  //PUT actualizar producto
  router.put('/:id', (req, res) => {
    let { id } = req.params;
    const { body } = req;
    id = parseInt(id);

    const products = new Products(productos)

    const productToChange = products.updateOne(id,body)
    if (productToChange){
      res.json({sucess: "ok", new: productToChange})
    }else{
      res.json({error: "producto no encontrado"})
    }

    res.json({ sucess: "ok", new: productToChange})
  });

  //DELETE CON ID 
  router.delete('/:id', (req, res) => {
    //debe ser let para introducir el cambio
    let { id } = req.params;  
    const products = new Products(productos)
    id = parseInt(id);


    const deleteProduct = products.deleteOne(id);

    if (deleteProduct != undefined){
      res.json({sucess: "ok", id })
    }else{
    res.json({error: "producto no encontrado"})  
    }
  });


app.post("/", (req, res) => {
    const respuesta={
        sucess: "ok",
        newProduct:{
            id: 1000,
            name: "adiddas",
            price: 123,
        }
    }
    res.json(respuesta)
})


//GET CON ID IDENTIFICADOR EN LA URL TIPO PARAMS
app.get('/:id', (req, res) => {
    let { id } = req.params;
    const encontrar = productos.find((item)=>item.id == id)
    if (encontrar){
        res.json(encontrar)
    }else{
    res.json({})
    }
  });




//POST CON BODY (SIN ID!!)
app.post('/', (req, res) => {
    const { body } = req;

    console.log(body)
    res.json("hola mundo")
  });


//PUT CON ID PARAMS SIEMPRE y BODY!
app.put('/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
   

    const productToChange = productos.find((item)=>item.id ==id)
    productToChange.price = body.price
    res.json({ sucess: "ok", new: productToChange})
  });


  //DELETE CON ID PARAMS SIEMPRE
app.delete('/:id', (req, res) => {
    const { id } = req.params;  
    const productsFilteredById = productos.filter((item)=> item.id != id)
    res.json("hola mundo")
  });




