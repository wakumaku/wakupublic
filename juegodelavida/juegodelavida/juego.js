/* ************************************ */
// CLONAR
Object.prototype.clone = function() {
	  var newObj = (this instanceof Array) ? [] : {};
	  for (i in this) {
	    if (i == 'clone') continue;
	    if (this[i] && typeof this[i] == "object") {
	      newObj[i] = this[i].clone();
	    } else newObj[i] = this[i];
	  } return newObj;
	};
/***************************************************************************/
/***************************************************************************/
// TABLERO	
function Tablero(ancho, alto, px){
   this.alto  = parseInt(alto);
   this.ancho = parseInt(ancho);
   this.px	  = px;
   this.anchopx = (this.ancho*px);
   this.altopx = (this.alto*px);
   
   this.numCeldes = this.alto*this.ancho;
   
   this.ocupacio = 0;
   this.ocupacioPercent = 0;
   this.contaCicles = 0;
   
   this.arCeldas 	= new Array(this.numCeldas);
   this.arCeldasClon= new Array(this.numCeldas);
   
   this.init();
   this.cargar();   
}

// Inicialitza arrays
Tablero.prototype.init = function(){
   var iC = 0;
   for ( var int = 0; int < this.alto; int++) {
		for ( var int2 = 0; int2 < this.ancho; int2++) {
			this.arCeldas[iC] = new Array(int,int2);
			iC++;
		}
   }
   this.arCeldasClon = this.arCeldas.clone();
};

// Carrega arrays amb dades aleatories
Tablero.prototype.cargar = function(){	
	for ( var int = 0; int < this.alto; int++) {
		for ( var int2 = 0; int2 < this.ancho; int2++) {
			this.arCeldas[int][int2] = (parseInt(Math.random()*11)<percentVives)?1:0;
		}
	}
	this.arCeldasClon = this.arCeldas.clone();
};

// Obté germans d'una celula
Tablero.prototype.getBrothers = function(x, y){
	var numBrothers = 0;var coordx; var coordy;
	for ( var int = -1; int <= 1; int++) {
		for ( var int2 = -1; int2 <= 1; int2++) {
			
			coordx = x+int;
			coordy = y+int2;
			
			if(!((coordx)>=0 && (coordx)<=this.ancho-1 &&
			     (coordy)>=0 && (coordy)<=this.alto-1)){
					if(coordx==this.ancho){	coordx = 0;}
					if(coordy==this.alto){	coordy = 0;}
					if(coordx==-1){			coordx = this.ancho-1;}
					if(coordy==-1){			coordy = this.alto-1;}
			}
			
			if(typeof this.arCeldasClon[coordx][coordy] != 'undefined'){
				if(parseInt(this.arCeldasClon[coordx][coordy]) == 1){
					numBrothers++;
				}
			}
		}
	}
	// Evitem que es conti ella mateixa
	return numBrothers-(this.arCeldasClon[x][y]);
};

Tablero.prototype.jugar = function(){
	/* 
	http://en.wikipedia.org/wiki/Conway's_Game_of_Life
		1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
		2. Any live cell with two or three live neighbours lives on to the next generation.
		3. Any live cell with more than three live neighbours dies, as if by overcrowding.
		4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	*/	
	var countVives=0;
	for ( var int = 0; int < this.alto; int++) {
		for ( var int2 = 0; int2 < this.ancho; int2++) {
			bViva = false;
			iBrothers = this.getBrothers(int, int2);
			bEstoyDead = (parseInt(this.arCeldasClon[int][int2])==0)?true:false;
			if(iBrothers<2)
				bViva = false;
			else if((iBrothers == 2 || iBrothers == 3) && !bEstoyDead) 
				bViva = true;
			else if(iBrothers > 3 && !bEstoyDead)
				bViva = false;
			else if(iBrothers == 3 && bEstoyDead)
				bViva = true;
			else
				bViva = false;
			
			if(bViva)countVives++;
			this.arCeldas[int][int2] = (bViva)?1:0;
		}
	}
	
	this.ocupacio 		 = countVives;
	this.ocupacioPercent = Math.round(countVives/this.numCeldes*10000)/100;
	this.contaCicles++;
	
	this.arCeldasClon = this.arCeldas.clone();
};

/***************************************************************************/
/***************************************************************************/
// GRAFIC
function Grafic(canvasObj, ancho, alto, px){
	
	   this.alto  = parseInt(alto);
	   this.ancho = parseInt(ancho);
	   this.px	  = px;
	   this.anchopx = (this.ancho*px);
	   this.altopx = (this.alto*px);
	   
	   this.numCeldes = this.alto*this.ancho;
	   
	   this.arCeldas 	= new Array(this.numCeldas);
	   this.arCeldasClon= new Array(this.numCeldas);
	   
	   this.ocanvas 	= canvasObj;
	   this.coordx  = 0;
	   this.coordy  = 0;
	   
	   this.ocanvas.width  = this.anchopx+3;
	   this.ocanvas.height = this.altopx+3;
	   
	   this.minim = 2000;
	   this.maxim = 0;
	   
	   this.lastMinim = 0;
	   this.lastMaxim = 0;
	   
	   // Inicialitza
	   this.init();
}

// Inicialitza grafic dibuixant una linea vermella
Grafic.prototype.init = function(){
	var iC = 0;
	   for ( var int = 0; int < this.alto; int++) {
			for ( var int2 = 0; int2 < this.ancho; int2++) {
				this.arCeldas[iC] = new Array(int,int2);
				iC++;
			}
	   }
	   this.arCeldasClon = this.arCeldas.clone();
};

Grafic.prototype.nouValor = function(valor, numcells){
	
	if(this.coordx<this.ancho){
		
		if(this.minim>numcells)
			this.minim = numcells;
		if(this.maxim<numcells)
			this.maxim = numcells;
		
		this.coordx++;
		
	}else{
		
		// Calcula Puntuacio
		calculaPunts();
		
		this.coordx =0;
		this.lastMaxim = this.maxim;
		this.lastMinim = this.minim;
		
		this.minim = this.lastMaxim;
		this.maxim = this.lastMinim;
		
	}
	
	this.coordy = parseInt(this.alto-valor); // TODO: relatiu a la altura
	
	if(this.coordx>0){
		var ires = 0;
		var basex = this.coordx;
		for ( var int = 0; int < 10; int++) {
			if(basex>99)basex=0;
			ires += this.arCeldas[basex+int][this.coordy];
		}
		if(ires==10) 
			countFideljoc++;
		else
			if(countFideljoc>0)
				countFideljoc--;
	}
	
	if((this.maxim==this.minim && this.coordx>1) || 
	   (this.lastMaxim==this.lastMinim && this.contaCicles>100) ||
	   (this.lastMaxim==this.maxim && this.lastMinim==this.minim)){
		if(countFideljoc>5){
			stopJoc();
		}
	}
	
	// Netegem tota la columna
	for ( var int = 0; int < this.alto; int++) {
		this.arCeldas[this.coordx][int] = 0;	
	}
	
	this.arCeldas[this.coordx][this.coordy] = 1; 
};

Grafic.prototype.plot = function(){
	 this.ocanvas.width = this.ocanvas.width; 
	 var ctx = this.ocanvas.getContext("2d");
	 for ( var int = 0; int < this.ancho; int++) {
		for ( var int2 = 0; int2 < this.alto; int2++) {
			sClass = (this.arCeldas[int][int2]==1)?"rgb(0,0,0)":"rgb(255,255,255)";
			if(int==this.coordx){sClass = "rgb(255,0,0)";}
			ctx.fillStyle = sClass;  
			ctx.fillRect ((int*this.px), (int2*this.px), this.px, this.px);
		}
	}
	ctx.strokeRect(0,0,this.anchopx+1,this.altopx+1);
	
	ctx.save();
	
	// Posicio cercles:
	var radius = 25;
	var x = this.ocanvas.width - radius +5;
	var y = this.ocanvas.height - radius +5;
	
	ctx.beginPath();
	var radius = Math.round(tablero.ocupacioPercent);
	
	ctx.beginPath();
	ctx.arc(x,y,radius,0,Math.PI*2,false);
	ctx.fillStyle = "rgba(0,0,0,0.3)";
	ctx.fill();
	
};

function initGrafic(){
	var graficCanvas = document.getElementById("canvasGraf");
	oGrafic = new Grafic(graficCanvas,99,60,2);
}
function plotGrafic(iValorPercent, numCelules){
	oGrafic.nouValor(iValorPercent, numCelules);
	oGrafic.plot();	
}

var oGrafic = false;

/***************************************************************************/
/***************************************************************************/

// Mode Canvas o DOM
var modeCanvas = true;

// Interval del joc
var t;
//Creació del tablero
var tablero = false;
var log;
var percentVives = 5;
//var contaCicles = 0;
var velocitat = 5;
var countFideljoc = 0;

function printLog(str){
	log = str;
	document.getElementById("log").innerHTML = log;
}

function execJoc(){	
	t=setInterval("runGame()",velocitat);
}

function runGame(){
	tablero.jugar();
	
	//plotGrafic((Math.round(tablero.ocupacioPercent)/1));
	plotGrafic((Math.round(tablero.ocupacio/10)/1),tablero.ocupacio);
	
	printLog(	"Cicles: "+tablero.contaCicles+
				"\nCelules vives: "+tablero.ocupacio+
				"\nOcupació: "+tablero.ocupacioPercent+"%"+
				"\nMaxim: "+oGrafic.maxim+
				"\nMinim: "+oGrafic.minim+
				"\nLastMaxim: "+oGrafic.lastMaxim+
				"\nLastMinim: "+oGrafic.lastMinim+
				"\nContafails: "+countFideljoc+
				"\nCoordX: "+oGrafic.coordx+
				"\nAncho: "+oGrafic.ancho);

	countVives = 0;
	printTablero(tablero);
}

function stopJoc(){
	
	clearInterval(t);
	
	alert("End!");
	
}

function resetJoc(){
	// Tablero principal
	tablero = new Tablero(64, 64, 6);
	// Grafic vives
	initGrafic();
	plotGrafic(0);
	
	clearInterval(t);
	tablero.cargar();
	printTablero(tablero);
	tablero.contaCicles = 0;
	countVives  = 0;
	percentOcupat = 0;
	printLog("Cicles: "+tablero.contaCicles+"\nCelules vives: "+countVives+"\nOcupació: "+percentOcupat+"%");
	
}

function printTablero(oTablero){
	printTableroCanvas(oTablero);
}


function printTableroCanvas(oTablero){
	 var canvas = document.getElementById("canvas");
	 canvas.width = canvas.width;
	 var ctx = canvas.getContext("2d");
	 
	 // establim el tamany del canvas
	 canvas.width  = oTablero.anchopx+3;
	 canvas.height = oTablero.altopx+3;
	 // Dibuixem les celules
	 for ( var int = 0; int < oTablero.ancho; int++) {
		for ( var int2 = 0; int2 < oTablero.alto; int2++) {
			sClass = (oTablero.arCeldas[int][int2]==1)?"rgb(0,0,0)":"rgb(255,255,255)";
			ctx.fillStyle = sClass;  
			ctx.fillRect ((int*oTablero.px)+2, (int2*oTablero.px)+2, oTablero.px-1, oTablero.px-1);
		}
	}
	 // Borde exterior
	ctx.strokeRect(0,0,oTablero.anchopx+3,oTablero.altopx+3);
}

function calculaPunts(){
	
	// 1. Si el maxim inicial > 1400
	if(oGrafic.maxim>=1400 && tablero.contaCicles==100){
		printPunts("Bona sembrada!",20);
	}
	
	// 2. Si en un cicle es supera el ultim maxim en +20 pts
	if(oGrafic.maxim>oGrafic.lastMaxim+10 && tablero.contaCicles>=100){
		printPunts("Remontada per la maxima!", 5);
	}
	if(oGrafic.minim>oGrafic.lastMinim+20 && tablero.contaCicles>100){
		printPunts("Remontada per la minima!", 5);
	}
	
	// 3. Si en un cicle es mante minim i maxim estables +-10
	if( ((oGrafic.maxim-oGrafic.lastMaxim)>-10) && ((oGrafic.maxim-oGrafic.lastMaxim)<10)  && tablero.contaCicles>=100){
		printPunts("Estable maxima!", 15);
	}
	if( ((oGrafic.minim-oGrafic.lastMinim)>-5) && ((oGrafic.minim-oGrafic.lastMinim)<5)  && tablero.contaCicles>=100){
		printPunts("Estable minima!", 15);
	}
	
	// 4. Acabar el joc en menys de 500 cicles
	if(tablero.contaCicles==99 && tablero.ocupacio>=400){
		printPunts("Inici superpoblat", 10);
	}
	
	// 5. Superar els 1000 cicles amb 300 celules
	if(tablero.contaCicles==99 && tablero.ocupacio>=300 && tablero.ocupacio<400){
		printPunts("Els inicis comodes", 5);
	}
	
	// 5. Superar els 1000 cicles amb 300 celules
	if(tablero.contaCicles==99  && (tablero.ocupacio>200 && tablero.ocupacio<300)){
		printPunts("Els inicis complicats", 15);
	}
	// 5. Superar els 1000 cicles amb 300 celules
	if(tablero.contaCicles==99  && (tablero.ocupacio<200)){
		printPunts("Els inicis xungos", 10);
	}
	
	
	if(tablero.contaCicles==999){
		printPunts("Milenari", 10);
	}
	if(tablero.contaCicles==1999){
		printPunts("Segle XXI", 20);
	}
	if(tablero.contaCicles==2999){
		printPunts("CC", 30);
	}
	
	// 6. Superar els 2000 cicles amb 300 celules
	if(tablero.contaCicles==999 && tablero.ocupacio>=300){
		printPunts("Supervivent", 20);
	}
	
	// 7. Superar els 3000 cicles amb 300 celules
	if(tablero.contaCicles==1999 && tablero.ocupacio>300){
		printPunts("Robinson", 40);
	}
	
	// 8. Superar 4000 cicles
	if(tablero.contaCicles==3999){
		printPunts("Ciclon!", 60);
	}
	
	// 9. Acabar el joc amb > 4%
	
}
function printPunts(sdesc, ipunts){
	var oScoreBoard = document.getElementById("logros");
	var sScore		= oScoreBoard.innerHTML;
	sScore +="\n"+sdesc+"\t\t"+ipunts;
	oScoreBoard.innerHTML = sScore;
}