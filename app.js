const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser');
const mysql=require('mysql');
const fs = require('fs');
const { connect } = require('http2');


const app = express();


const port = 6789;


app.use(cookieParser())
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
//app.use("/styles", express.static(__dirname + '/public'));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res



app.get('/', (req, res) => {
	

	res.render('index');
	

});

app.get('/ponturi-pariuri', (req, res) => res.render('ponturi-pariuri'));

app.get('/joc', (req, res) => {
	
	res.render('joc');
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));