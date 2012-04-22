

$(document).ready(function(){

	joc.crearcontrolfitxes();
	
	$("#cmdInicia").click(function(){
		runtest();
	});
	
});

var vivain = false;
function runtest() {
	var f = joc.obtenirfitxacontrolaleatoria(joc.arBando[0], vivain);
	alert(f.viva + ' - ' + f.tipus + ' - ' + f.rang);
	f.viva = !f.viva;
	f = joc.obtenirfitxacontrolaleatoria(joc.arBando[0], !vivain);
	alert(f.viva + ' - ' + f.tipus + ' - ' + f.rang);
	vivain = !vivain;
}

/* Objectes del joc */

// Definim tots els objectes i variables necessàries per al joc.

// Tablero
var tablero		= new Array(8*8); 	// Array unidimensional de 64 celes de tipus (cella)
var control		= new Array(32);	// Array de contro de fitxes de tipus (fitxa)

// Cel·la
var cella		= new Object();
cella.X			= false;	// char: A, B, C, D, E, F, G, H
cella.Y			= false;	// char: A, B, C, D, E, F, G, H
cella.fitxa		= false;	// (fitxa): Serà de tipus fitxa o false

// Fitxa
var fitxa		= new Object();
fitxa.bando		= false;	// char: vermell o blau
fitxa.rang		= false;	// int: 0, 1, 2, 3, 4, 5
fitxa.tipus		= false;	// char: Bandera, Soldat, Bomba
fitxa.id		= false;	// int: identificarà fitxes repetides i les farà uniques
fitxa.viva		= false;	// bool: true/false
fitxa.creafitxa	= function(tipus, bando, rang, id, viva){
	this.bando 	= bando;
	this.rang	= rang;
	this.tipus	= tipus;
	this.id		= id;
	this.viva	= viva;
	return this;
};

// Arrays de suport
var arBando 	= new Array('vermell','blau');
var arFitxa		= new Array('Bandera', 'Soldat', 'Bomba');
var arFiles		= new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H');

//Joc
// Encapsulem tot dins del objecte Joc que controlarà tota la festa.
var joc			= new Object();
joc.tablero		= tablero;
joc.control		= control;
joc.cella		= cella;
joc.fitxa		= fitxa;
joc.arBando		= arBando;
joc.arFitxa		= arFitxa;
joc.arFiles		= arFiles;
joc.torn		= false;	// char: vermell o blau
joc.inicijoc	= false;	// date: data inici del joc
joc.finaljoc	= false;	// date: data final del joc
joc.contatorn	= false;	// int:	 conta el numero de torns

/* Processos del Joc */

/** crearcontrolfitxes()
 * 	Crea la matriu de control amb totes les fitxes */
joc.crearcontrolfitxes = crearcontrolfitxes;
function crearcontrolfitxes(){
	
	/*	Esquema que defineix totes les fitxes que necessitem
	 *		-	2 	Banderes, 	1 vermella 	+ 	1 blava
	 *	 	-	6 	Bombes,		3 vermelles + 	3 blaves
	 *		-	24	Soldats,	12 vermells	+	12 blaus
	 *			-	8	Soldats R1	4 vermells	+	4 blaus
	 *			-	4	Soldats R2	2 vermells	+	2 blaus
	 *			-	4	Soldats R3	2 vermells	+	2 blaus
	 *			-	4	Soldats R4	2 vermells	+	2 blaus
	 *			-	4	Soldats R5	2 vermells	+	2 blaus
	 */

	// Crearem 32 fitxes al control	
	// 16 vermells
	this.control[0]		=	new this.fitxa.creafitxa(	this.arFitxa[0],  this.arBando[0],	0,		0,		false);
	this.control[1]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	1,		0,		false);
	this.control[2]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	1,		1,		false);
	this.control[3]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	1,		2,		false);
	this.control[4]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	1,		3,		false);
	this.control[5]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	2,		0,		false);
	this.control[6]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	2,		1,		false);
	this.control[7]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	3,		0,		false);
	this.control[8]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	3,		1,		false);
	this.control[9]		=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	4,		0,		false);
	this.control[10]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	4,		1,		false);
	this.control[11]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	5,		0,		false);
	this.control[12]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	5,		1,		false);
	this.control[13]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[0],	3,		0,		false);
	this.control[14]	=	new this.fitxa.creafitxa(	this.arFitxa[2],  this.arBando[0],	3,		1,		false);
	this.control[15]	=	new this.fitxa.creafitxa(	this.arFitxa[2],  this.arBando[0],	3,		2,		false);
	// 16 blaus
	this.control[16]	=	new this.fitxa.creafitxa(	this.arFitxa[0],  this.arBando[1],	0,		0,		false);
	this.control[17]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	1,		0,		false);
	this.control[18]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	1,		1,		false);
	this.control[19]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	1,		2,		false);
	this.control[20]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	1,		3,		false);
	this.control[21]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	2,		0,		false);
	this.control[22]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	2,		1,		false);
	this.control[23]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	3,		0,		false);
	this.control[24]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	3,		1,		false);
	this.control[25]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	4,		0,		false);
	this.control[26]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	4,		1,		false);
	this.control[27]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	5,		0,		false);
	this.control[28]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	5,		1,		false);
	this.control[29]	=	new this.fitxa.creafitxa(	this.arFitxa[1],  this.arBando[1],	3,		0,		false);
	this.control[30]	=	new this.fitxa.creafitxa(	this.arFitxa[2],  this.arBando[1],	3,		1,		false);
	this.control[31]	=	new this.fitxa.creafitxa(	this.arFitxa[2],  this.arBando[1],	3,		2,		false);	
	
}

joc.obtenirfitxacontrolaleatoria = obtenirfitxacontrolaleatoria;
function obtenirfitxacontrolaleatoria(bando, viva){
	var min = 0;
	var max = 32;
	var base = 0;
	var fitxa = false;
	var count = 0;
	
	if (bando == this.arBando[0]) {
		max = 16;
	} else {
		min = 16;
	}
	
	base = 5; // random entre min max
	
	if (this.control[base].viva == viva) {
		
		fitxa = this.control[base];
		
	} else {
		for (var i = min; i < max; i++){
			
		}
	}
	
	return fitxa;
}