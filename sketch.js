//TODO: 3D?
var boids = [];
var alignmentSlider, cohesionSlider, separationSlider;
let valA, valC, valS;

function setup() {
  //TODO: more sliders (maxF/maxV/mass/...)
  let container = createDiv('Radii:')
  let labelA = createDiv("Aligmment:").style('display','flex').style('justify-content','space-between').style('width','50%').parent(container);
  valA = createSpan(75).parent(labelA);
  alignmentSlider = createSlider(0, 250, 75, 1).parent(labelA);     //75-100
  let labelC = createDiv("Cohesion:").style('display','flex').style('justify-content','space-between').style('width','50%').parent(container);
  valC = createSpan(50).parent(labelC);
  cohesionSlider = createSlider(0, 250, 50, 1).parent(labelC);      //50-75
  let labelS = createDiv("Separation:").style('display','flex').style('justify-content','space-between').style('width','50%').parent(container);
  valS = createSpan(35).parent(labelS);
  separationSlider = createSlider(0, 250, 35, 1).parent(labelS);    //35-50

  createCanvas(1080, 610);
  //TODO: flock class?
  //FIXME: multithreading/quadtree/spacial_subdivision
  for (let i = 0; i < 60; i++) {
    let c = color(255, 120, 120);
    boids.push(new Boid(c))
  }
  for (let i = 0; i < 20; i++) {
    let c = color(120, 255, 120);
    boids.push(new Boid(c))
  }
  for (let i = 0; i < 60; i++) {
    let c = color(120, 120, 255);
    boids.push(new Boid(c))
  }
}

function draw() {
  background(200);
  //update values from sliders
  valA.html(alignmentSlider.value());
  valC.html(cohesionSlider.value());
  valS.html(separationSlider.value());

  //clone array for snapshot
  const boids2 = boids.map(boid => boid.copy());
  //update each boid based on old snapshot
  boids2.forEach(boid => {
    //edge checking
    boid.edges();
    //flocking
    boid.flock(boids);

    boid.update();
    boid.show();
  });
  //update snapshot
  boids = boids2;
}
