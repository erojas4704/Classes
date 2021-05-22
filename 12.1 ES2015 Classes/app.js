class Vehicle {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    honk() {
        return "beep";
    }

    toString() {
        return `The vehicle is a ${make} ${model} from ${year}.`;
    }
}

class Car extends Vehicle {
    constructor(make, model, year, numWheels) {
        super(make, model, year);
        this.numWheels = numWheels;
    }
}

class Motorcycle extends Vehicle {
    constructor(make, model, year) {
        super(make, model, year);
        this.numWheels = 2;
    }

    revEngine() {
        return "Vroom!";
    }
}

class Garage {
    constructor(capacity) {
        this.vehicles = [];
        this.capacity = capacity;
    }

    add(vehicle) {
        if (vehicle instanceof Vehicle) {
            if (this.vehicles.length >= this.capacity) {
                return "Sorry, we're full.";
            } else {
                this.vehicles.push(vehicle);
                return this.vehicles;
            }
        } else {
            return "Can only add vehicles.";
        }
    }
}

let garage = new Garage(2);
let toyota = new Car("Toyota", "Hellscaper", 666, 50);

console.log(
    garage.add(toyota),
    garage.add(new Car("Bentley", "Assrider", 2020, 15)),
    garage.add(new Car("Ford", "Biter", 2020, 15)),
    garage.add("taco")
)
