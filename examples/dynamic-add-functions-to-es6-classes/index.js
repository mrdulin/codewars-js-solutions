class Test {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  sayName() {
    console.log(this.name);
  }

  sayAge() {
    console.log(this.age);
  }
}

const coin = () => Math.random() < 0.5;

if (coin()) {
  Test.prototype.sayHello = function sayHello() {
    console.log('hello');
  };
}

const m = new Test();
m.sayHello();
