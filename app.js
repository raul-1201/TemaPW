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


var utilizatori;
fs.readFile('utilizatori.json', (err, data) => {
    if (err) throw err;
    utilizatori = JSON.parse(data);
    
});

var con = mysql.createConnection({
	host: "localhost",
	user: "test",
	password: "test1234"
  });


var con1=mysql.createConnection({
	host: "localhost",
	user: "test",
	password: "test1234",
	database: "Cumparaturi"
  });
app.get('/', (req, res) => {
	

	res.render('index',{log:req.cookies['cookieLogin']});
	

});

app.get('/creare-bd', (req, res) => {
	
	con.query("CREATE DATABASE IF NOT EXISTS Cumparaturi", function (err, result) {
		
		console.log("Database created");
	  }); 

	  sql="CREATE TABLE IF NOT EXISTS Cumparaturi.Produse(idProdus INT primary key, nume VARCHAR(255), pret INT);"; 
	  con.query(sql,function(err,result){ 
		  console.log("Table created!");
	  });
	  res.redirect('/')
});
app.get('/inserare-bd', (req, res) => {
	var valori=[ 
		[1,'Caiet',5], 
		[2,'Dosar',7], 
		[3,'Carte',15]	 
];
	var sql = "INSERT INTO Cumparaturi.Produse (idProdus, nume, pret) VALUES ?";
  	con.query(sql,[valori], function (err, result) { 
	console.log("1 record inserted");
});
	  res.redirect('/')
}); 


app.get('/autentificare', (req, res) => res.render('autentificare',{cookieErr:req.cookies['cookieErr']}));
app.post('/verificare-autentificare', (req, res) => {
	console.log(req.body);
	//console.log(req.body["uname"]);
	if(req.body["uname"]==utilizatori[0].uname && req.body["psw"]==utilizatori[0].psw )
	{
		res.cookie('cookieLogin','Bine ai venit, '+ req.body['uname']+'!',{maxAge:600000,httpOnly:true});
		//console.log(req.cookies['log']);
		if(req.cookies['uname']!=null)
		{
			res.clearCookie('uname');
		}
		res.redirect('/');
		
	}
	  	
		
	else
	{
		res.cookie('cookieErr','Utilizatorul sau parola sunt gresite',{maxAge:1000,httpOnly:true});
		res.cookie('uname', null);
		res. redirect('/autentificare');
		
		res.end();
	}
	
});



var intrebari;
fs.readFile('intrebari.json', (err, data) => {
    if (err) throw err;
    intrebari = JSON.parse(data);
    
});


// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {
	
	res.render('chestionar', {intrebari});
});

app.post('/rezultat-chestionar', (req, res) => {
		//console.log(req.body);
		//res.send("formular: " + JSON.stringify(req.body));
		
		var i;
		var raspunsCorect=0 ;
		for(i=0;i<intrebari.length;i++)
		{
			
			
			if(intrebari[i].corect==req.body["var"+(i+1)])
			{

				raspunsCorect++;
				
			}
			
		}
		
		res.render('rezultat-chestionar',{intrebari,raspunsCorect })
});


app.get('/delogare', (req, res) => {
	if(req.cookies['cookieLogin']!=null)
	{
		res.clearCookie('cookieLogin');
		res.redirect('/');
	}
});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));