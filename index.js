const http= require("http");
const fs= require("fs");
var requests=require("requests");


const homeFile=fs.readFileSync("home.html","utf-8");
const replaceVal=(tempVal,orgVal) => {
  const t1=orgVal.main.temp;
  const t2= t1-273;
  let temperature= tempVal.replace("{%tempval%}",t2.toFixed(2));
  const t3=(orgVal.main.temp_min)-273;
  temperature= temperature.replace("{%tempmin%}", t3.toFixed(2));
  const t4=(orgVal.main.temp_max)-273;
  temperature= temperature.replace("{%tempmax%}", t4.toFixed(2));
  temperature= temperature.replace("{%location%}", orgVal.name);
  temperature= temperature.replace("{%country%}", orgVal.sys.country);
  return temperature;
}
const server = http.createServer((req,res) => {
    if(req.url=="/"){
        requests(
          "https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=9bdf978fb73c048adb4751130dfe7840"
          )
    
      .on("data",(chunk) =>{
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];
          const t1=arrData[0].main.temp;
          const t2= t1-273;
         console.log(t2.toFixed(2));
        const realTimaData = arrData
           .map((val) => 
           replaceVal(homeFile,val))
           .join("");
          res.write(realTimaData);
        // console.log(realTimaData);
        }) 
      .on("end",(err) => {
         if (err) return console.log("connection closed due to errors", err);
        res.end();
    });
  }
});

server.listen(8000,"127.0.0.1");