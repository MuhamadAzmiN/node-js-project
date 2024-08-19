const express = require('express')

const expressLayouts = require('express-ejs-layouts')
require('./utils/db')
const Contact = require('./model/contact')
const app = express()
const port = 3001




// set up ejs 

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended : true }))


const { body , validationResult, check, Result } = require('express-validator')

// set up method overried
const methodOverried = require('method-override')

app.use(methodOverried('_method'))
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
// konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
    cookie : {maxAge : 6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))


app.use(flash())

app.get('/', (req, res) => {

    const mahasiswa = [
        {
            nama : "azmi",
            email : "azmi8017@gmail.com"
        },
        {
            nama : "asep",
            email : "asep@gmail.com"
        }
    ]



    res.render('index', {
        layout : 'layouts/main-layout',
        title : "Home",
        nama : "azmi",
        mahasiswa : mahasiswa
    })
})

// Halaman About
app.get('/about', (req, res, next) => {

    res.render('about', {
        layout : 'layouts/main-layout',
        title : "About"
    })

})

// Halaman contact
app.get('/contact', async (req, res) => {

    // Contact.find().then((contact) => {
    //     res.send(contact)
    // }) 
    const contact = await Contact.find()
    
    res.render('contact', {
        layout : 'layouts/main-layout',
        title : "Contaact",
        contact : contact,
        msg : req.flash('msg')
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title : "Form Tambah Data Contact",
        layout: 'layouts/main-layout'
    })
})

// proses tambah data contact

app.post('/contact', [
    body('nama').custom( async (value, {req}) => {
        const duplikat = await Contact.findOne({ nama : value })
        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama contact sudah digunakan')
        }

        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHp', 'No Hp Tidak Valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        res.render('edit-contact', {
            title : "form ubah data contact",
            layout  : 'layouts/main-layout',
            errors : error.array(),
            contact : req.body

        })

        
    }else {
        Contact.insertMany(req.body, (err) => {
            req.flash('msg', "Data Contact berhasil diupdate")
            res.redirect('/contact')

        })
        // kirim kan flash message
    }

})

// app.get('/contact/delete/:nama',  async (req, res) => {
//     const contact = await Contact.findOne({ nama : req.params.nama})
//     if(!contact) {
//         req.statusCode(404)
//         res.send('<h1>404</h1>')
//     }else {
//         Contact.deleteOne({ _id : contact._id }).then((result, err) => {

//             req.flash('msg', 'contact berhasil terhapus')
//             res.redirect('/contact')
//         })
//     }
// })
app.put('/contact', [
    body('nama').custom( async (value, {req}) => {
        const duplikat = await Contact.findOne({ nama : value })
        if(value !== req.body.oldNama && duplikat){
            throw new Error('Nama contact sudah digunakan')
        }

        return true
    }),
    check('email', 'Email Tidak Valid').isEmail(),
    check('noHp', 'No Hp Tidak Valid').isMobilePhone('id-ID')
    ], (req, res) => {
    const error = validationResult(req)
    if(!error.isEmpty()){
        res.render('edit-contact', {
            title : "form ubah data contact",
            layout  : 'layouts/main-layout',
            errors : error.array(),
            contact : req.body

        })

        
    }else {
        Contact.updateOne(
            { _id : req.body._id},
            {
                $set : {
                    nama : req.body.nama,
                    email : req.body.email,
                    noHp : req.body.noHp
                }
            }

        ).then((result) => {
            req.flash('msg', "Data Contact berhasil diupdate")
            res.redirect('/contact')
        })
        // kirim kan flash message
    }

})

app.delete('/contact', (req,res) => {
    Contact.deleteOne({  nama : req.body.nama }).then((result, err) => {
        req.flash('msg', 'contact berhasil terhapus')
        res.redirect('/contact')
    })
})


app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama : req.params.nama })
    res.render('edit-contact', {
        title : "Form Ubah Data Contact",
        layout: 'layouts/main-layout',
        contact : contact
    })
})
app.get('/contact/:nama', [], async (req, res) => {
    // const contact = findContact(req.params.nama)
    const contact = await Contact.findOne({ nama : req.params.nama})

    
    res.render('detail', {
        layout : 'layouts/main-layout',
        title : "Halaman detail contact",
        contact : contact
    })    
})   



app.listen(port, () => {
    console.log(`Mongo Contact App http://localhost:${port}`)
})

