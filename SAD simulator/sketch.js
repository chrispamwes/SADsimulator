// exported from https://open-meteo.com/en/docs#api_form 
let weatherjson = false; 
let motherload = 0; 
let counter = 0; 
let yr, ukdate; 
let myFont;
let bg;
let y = 0;
var drop = [];

//'weather loaded' variable name changed to 'motherload' in order to personalise
//the code (-: this program is created in an attempt to simulate how my mood is
//affeted by the weather, so in tribute to simulations... my favourite game growing
//up was the sims! the hack you use to get more money is called 'motherload' which
//is a play on words as mother has loaded (the mother being the earth) and a silly sims
//reference.
//using custom font for aesthetic purposes
function preload() { //making a function called preload guarantees font loads before setup and draw
  myFont = loadFont('RubikBubbles-Regular.ttf');
}

function setup() { //this runs at beginning of start
  
  bg = loadImage('bg1.png');
  createCanvas(1920, 1080);
  setInterval(countdown, 1000);//countdown refereshes every second

    for(var i = 0; i<100; i++) {
    raindrop[i] = new raindrop();
    }
}
  
  
//loading countdown in corner to see date and load JSON data every 30 seconds
function countdown(){ 
  let m = month();
  let d = day();
  counter--; 

   //timer loads JSON data every 30 seconds
  if(counter<0){
    counter = 30;        
    yr = int(random(2001, 2022)); //from my birth, to this day
    //api date in usa time --> converted to uk
    let apidate = `${yr}-${m}-${d}`;
    ukdate = `${d}/${m}/${yr}`;
 
    //now build the weather URL (using https://open-meteo.com/en/docs#api_form)
    let url_weather = "https://archive-api.open-meteo.com/v1/era5?";
    url_weather += `latitude=51.5002&longitude=-0.1262`;
    url_weather += `&start_date=${apidate}&end_date=${apidate}`;
    url_weather += "&daily=temperature_2m_max,rain_sum&timezone=auto";
    // load the json
    loadJSON(url_weather, loadedweather); 
  }
}

//function to call loadedweather function once json is loaded
function loadedweather(json){
  weatherjson = json; 
  motherload++; 
} // with every iteration, add 1 to how many times the weather has been loaded (every 30 secs)


function draw() {
  background(bg);

  let ex = winMouseX;
  let why = winMouseY;

  let cx = width/2;
  let cy = height/2;

  let hoff = 10; //offset for highlights

  let title = 'The Christine-Mood\nPredictor'
  let datetext = `On the ${ukdate}\n Christine was probably feeling:`

  //highlight variable
  let hx = map(ex,0,width,-hoff,hoff); //left of centre, right of centre
  let hy = map(why,0,height,-hoff,hoff); // top of centre, bottom of centre
  
  //shadow variables
  let shadow = 4;
  let sx = hx*-shadow;
  let sy = hy*-shadow;

  push();

  textSize(60);
  textAlign(CENTER);
  noStroke();

  //shadow text
  fill(50, 35, 145);
  text(title,(cx-100)+sx, (cy-450)+sy);

  //highlighted text
  fill(255, 243, 219);
  text(title,(cx-100)+hx, (cy-450)+hy);
  
  //primary text
  fill(237, 168, 199);
  text(title,cx-100,cy-450);

  pop();

  push();
  textFont('Georgia');
  textSize(40);
  textAlign(CENTER);
  noStroke();
  text(datetext, cx-100,cy-240);

  //if json hasn't loaded then DO NOT LOAD
  if(weatherjson===false) return;

  //if it has loaded, then get temp
  let temp = weatherjson.daily.temperature_2m_max;
  let rain = weatherjson.daily.rain_sum;

  for (var i = 0; i < 100; i++){
    raindrop[i].show();
    raindrop[i].update();
  }
  
  
 //draw data as text from json file
  textSize(20);
  textFont(myFont)
  let x = 10;
  let y = windowHeight-50;
  textAlign(LEFT);
  fill(255);
  text(` Date: ${ukdate}`, x, y);
  text(`Temp:  ${temp}°C`, x, y+20);
  text(` Rain:  ${rain}mm`, x, y+40);

}

function raindrop(){
  this.x=random(0,width);
  this.y=random(0,-height);

  this.show = function(){
    noStroke();
    fill(255);
    ellipse(this.x, this.y, 2, 10); //2 px wide 10 px wide
  }
}

this.update = function(){
  this.y = this.y + 8;

  if (this.y >height){
    this.y= random(0, -height);
  }
}