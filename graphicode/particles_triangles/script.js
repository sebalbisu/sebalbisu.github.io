var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var canvasBg = document.getElementById('canvasBg');
var ctxBg = canvasBg.getContext('2d');

var _ = {
  quantity : 50,
  radius: 0,
  points: []
};

function distance(p0, p1)
{
    return Math.sqrt(
        Math.pow(p0.x - p1.x, 2) + 
        Math.pow(p0.y - p1.y, 2));
}

function Point(x, y, velx, vely) {
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.links = [];
    this.update = function()
    {
        var x = this.x + this.velx;
        if(x > canvas.width){
            x = canvas.width;
            this.velx *= -1;
        }        
        if(x < 0){
            x = 0;
            this.velx *= -1;
         }
        this.x = x;
        var y = this.y + this.vely;
        if(y > canvas.height) {
            y = canvas.height;
             this.vely *= -1;
        }
        if(y < 0) {
            y = 0;
            this.vely *= -1;
        }        
        this.y = y;  
    };
    this.draw = function()
    {
        ctx.fillStyle = 'rgba(0,0,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, _.radius, 0, 2*Math.PI);
        ctx.fill();        
    };
    this.drawLinks = function()
    {
        for(var i in this.links){
            ctx.beginPath();    
            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.links[i].x, this.links[i].y);
            ctx.stroke();
        }
    };
    this.getMinimunDistance = function(points)
    {
        this.links = [];
        var i = this == points[0] ? 2 : 1;
        var list = [];
        var dist = distance(points[i-1], this);
        list[0] = {point: points[i-1], dist: dist};
        for(i; i < points.length; i++){
            if(this === points[i]) continue;
            var distNew = distance(points[i], this);
            var pointNew = {point: points[i], dist: distNew};
            if(pointNew.dist < list[0].dist){ 
              list.splice(0, 0, pointNew); 
            } else if (list.length > 1 && distNew < list[1].dist) {
              list.splice(1, 0, pointNew);  
            } else if (list.length > 2 && distNew < list[2].dist) {
              list.splice(2, 0, pointNew);  
            } else {
              list.push(pointNew);
            }
        }
        
        this.links.push(list.shift().point);
        this.links.push(list.shift().point);
        this.links.push(list.shift().point);
        this.links.push(list.shift().point);
    };
}

function createPoints()
{
  for(var i=0; i<_.quantity; i++)
  {
     _.points.push(new Point(
      Math.random() * canvas.width, 
      Math.random() * canvas.height,
      Math.ceil(Math.ceil(Math.random() * 4) * Math.random()),
      Math.floor(Math.ceil(Math.random() * 4) * Math.random())
    ));
  }
}

function updatePoints()
{
  for(var i in _.points)
  {
    _.points[i].update();
    _.points[i].getMinimunDistance(_.points);
  }
}

function draw()
{
  ctx.clearRect(0,0,canvas.width, canvas.height);
  for(var i in _.points)
  {
    _.points[i].draw();
    _.points[i].drawLinks();     
  }


}

function init()
{
  createPoints();
}

init();

function animate(time)
{
    updatePoints();
    draw();
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

