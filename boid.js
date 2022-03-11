class Boid {
    constructor() {
        if (arguments.length > 1) {
            this.position = arguments[0];
            this.velocity = arguments[1];
            this.acceleration = arguments[2];
            this.mass = arguments[3];
            this.perceptionRadius = arguments[4];
            this.neighbourRadius = arguments[5];
            this.separationRadius = arguments[6];
            this.maxForce = arguments[7];
            this.maxVelocity = arguments[8];
            this.type = arguments[9];
        } else {
            this.position = createVector(random(width), random(height));
            this.velocity = p5.Vector.random2D();
            this.acceleration = createVector();
            this.mass = (random(0.85, 1.5) + random(0.85, 1.5));
            this.perceptionRadius = random(alignmentSlider.value(), alignmentSlider.value()+25);
            this.neighbourRadius = random(cohesionSlider.value(), cohesionSlider.value()+25);
            this.separationRadius = random(separationSlider.value(), separationSlider.value()+15);
            this.maxForce = 0.85;
            this.maxVelocity = 4;
            this.type = arguments[0]

            this.velocity.setMag(this.mass * 3);
        }
    }

    copy() {
        let copy = new Boid(
            this.position.copy(),
            this.velocity.copy(),
            createVector(),
            this.mass,
            this.perceptionRadius,
            this.neighbourRadius,
            this.separationRadius,
            this.maxForce,
            this.maxVelocity,
            this.type
        );
        return copy;
    }

    equals(boid) {
        let result = 0;
        result += this.position.equals(boid.position);
        result += this.velocity.equals(boid.velocity);
        result += this.acceleration.equals(boid.acceleration);
        result += this.mass === boid.mass;
        result += this.type.toString() === boid.type.toString();
        return result === 5;
    }

    flock(boids) {
        //TODO: use sliders
        //TODO: sight not behind
        let force = createVector();
        let perceptionVicinity = boids.filter(boid => !this.equals(boid) && this.type.toString() === boid.type.toString() && this.position.dist(boid.position) <= this.perceptionRadius);
        let neighbourVicinity = boids.filter(boid => !this.equals(boid) && this.type.toString() === boid.type.toString() && this.position.dist(boid.position) <= this.neighbourRadius);
        let separationVicinity = boids.filter(boid => !this.equals(boid) && this.position.dist(boid.position) <= this.separationRadius);
        if (perceptionVicinity.length > 0) {
            //alignment
            force.add(this.alignment(perceptionVicinity));
        }
        if (neighbourVicinity.length > 0) {
            //cohesion
            force.add(this.cohesion(neighbourVicinity));
        }
        if (separationVicinity.length > 0) {
            //sepparation
            force.add(this.separation(separationVicinity));
        }
        this.acceleration = force.div(this.mass);
    }

    alignment(vicinity) {
        //steer towards the average heading of local flockmates
        let steering = vicinity.reduce((sum, boid) => sum.add(boid.velocity), createVector());
        steering.div(vicinity.length);//average => divide by total
        steering.setMag(this.maxVelocity);//make velocity
        steering.sub(this.velocity);//find velocity difference
        return steering.limit(this.maxForce);
    }

    cohesion(vicinity) {
        //steer to move toward the average position of local flockmates
        let steering = vicinity.reduce((sum, boid) => sum.add(boid.position), createVector());
        steering.div(vicinity.length);//average => divide by total
        steering.sub(this.position);//find position difference
        steering.setMag(this.maxVelocity);//make velocity
        steering.sub(this.velocity);//find velocity difference
        return steering.limit(this.maxForce);
    }

    separation(vicinity) {
        //steer to avoid crowding local flockmates
        //let steering = vicinity.reduce((sum, boid) => sum.add(p5.Vector.sub(this.position, boid.position).div(this.position.dist(boid.position))), createVector()); //problem with 0 division
        let steering = createVector();
        for (const boid of vicinity) {
            let d = this.position.dist(boid.position);
            if (d === 0) {
                d = 0.001;
            }
            let diff = p5.Vector.sub(this.position, boid.position).div(d);
            steering.add(diff)
        }
        steering.div(vicinity.length);//average => divide by total
        steering.setMag(this.maxVelocity);//make velocity
        steering.sub(this.velocity);//find velocity difference
        return steering.limit(this.maxForce);
    }

    edges() {
        //teleport edges to other side
        //if (this.position.x > width) {
        //    this.position.x = 0;
        //} else if (this.position.x < 0) {
        //    this.position.x = width;
        //}
        //if (this.position.y > height) {
        //    this.position.y = 0;
        //} else if (this.position.y < 0) {
        //    this.position.y = height;
        //}
        //bounce off edges
        if (this.position.x >= width) {
            this.velocity.setHeading(this.velocity.heading() + HALF_PI);
        } else if (this.position.x <= 0) {
            this.velocity.setHeading(this.velocity.heading() + HALF_PI);
        }
        if (this.position.y >= height) {
            this.velocity.setHeading(this.velocity.heading() + HALF_PI);
        } else if (this.position.y <= 0) {
            this.velocity.setHeading(this.velocity.heading() + HALF_PI);
        }
        //steer away from edge area
    }

    update() {
        //prevent going outside of canvas
        //this.edges();
        //update movement
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.setMag(this.maxVelocity);

    }

    show() {
        //TODO: triangles
        stroke(this.type);
        strokeWeight(this.mass);

        let x2 = this.position.mag * cos(this.position.heading) + this.position.x;
        let y2 = this.position.mag * sin(this.position.heading) + this.position.y;
        line(
            this.position.x,
            this.position.y,
            x2,
            y2
        );
        //point(this.position.x, this.position.y);
        line(this.position.x, this.position.y,this.position.x+this.velocity.x,this.position.y+this.velocity.y);
    }
}