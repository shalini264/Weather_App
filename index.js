const fs = require('fs');
const http = require('http');
const requests = require("requests");
const home = fs.readFileSync("home.html","utf-8");
const FtoC = (Feh)=>{
return (Feh-273.15);
};
const func1=(temp,org)=>{
    const Dayd=(d)=>{
        var Week = new Array(7);
        Week[0]="Monday";
        Week[1]="Tuesday";
        Week[2]="Wednesday";
        Week[3]="Thursday";
        Week[4]="Friday";
        Week[5]="Saturday";
        Week[6]="Sunday";
        return Week[d];
    }
    const Monthm=(m)=>{
        var Months = new Array(12);
        Months[0]="January";
        Months[1]="Februrary";
        Months[2]="March";
        Months[3]="April";
        Months[4]="May";
        Months[5]="June";
        Months[6]="July";
        Months[7]="August";
        Months[8]="September";
        Months[9]="October";
        Months[10]="November";
        Months[11]="December";
        return Months[m];
    }
    var t = new Date();
    var d = t.getDay();
    var m = t.getMonth();
    var y = t.getFullYear();
    var tim = t.toLocaleTimeString();  
    let tempt = temp.replace("{%location%}",org.name);
    tempt = tempt.replace("{%mintemp%}",FtoC(org.main.temp_min));
    tempt = tempt.replace("{%maxtemp%}",FtoC(org.main.temp_max));
    let weather=org.weather[0].main;
    tempt = tempt.replace("{%country%}",org.sys.country);
    tempt = tempt.replace("{%description%}",org.weather[0].description);
    tempt = tempt.replace("{%temper%}",FtoC(org.main.temp));
    tempt = tempt.replace("{%date%}",`${Dayd(d-1)}|${Monthm(m)},${y}|${tim}`);
    
    if(weather=="Clear"){
       tempt = tempt.replace("{%weather%}",'<i class="fas fa-sun fa-spin fa-5x" style="color:yellow"></i>');
   }
   
   else if(weather=="Rain"){
      tempt = tempt.replace("{%weather%}",'<i class="fas fa-cloud-rain fa-5x" style="color:yellow"></i>');
   }
   else if(weather=="Smoke"){
    tempt = tempt.replace("{%weather%}",'<i class="fas fa-smog fa-5x" style="color:yellow;"></i>');
 }
   
   else{
    tempt = tempt.replace("{%weather%}",'<i class="fas fa-cloud-sun fa-5x" style="color:yellow"></i>');
 }
    return tempt;
};
const server=http.createServer((req,res)=>{
   if(req.url == "/")
   {
       requests("http://api.openweathermap.org/data/2.5/weather?q=Jammu&appid=276b245aa29ab73075bef789eb29790b")

   
   .on("data",(chunk)=>{
       const obj = JSON.parse(chunk);
       const arr = [obj]
       const replaceF =arr.map((val)=>func1(home,val)).join("");
       res.write(replaceF);
       //console.log(replaceF);
})
   .on("end",(err)=>{
      if(err)
       res.end();
   })
};
});
server.listen(3000);