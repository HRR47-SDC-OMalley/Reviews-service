/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const faker = require('faker');
const now = require('performance-now');
const colors = require('colors');
const path = require('path');
const csvWriter = require('csv-write-stream');

// Data Size:
const limit = 10000000;

class Writer {
  constructor(file) {
    this.writer = csvWriter();
    this.writer.pipe(fs.createWriteStream(file, { flags: 'a' }));
  }

  write(obj) {
    if (!this.writer.write(obj)) {
      return new Promise((resolve) => this.writer.once('drain', resolve));
    }
    return true;
  }

  end() {
    this.writer.end();
  }
}

const start = now();
(async () => {
  const writer = new Writer(path.resolve('database', 'seedFiles', 'test.csv'));
  for (let i = 0; i < 1e7; i += 1) {
    const name = faker.commerce.productName();
    const guitar = {
      name,
      productId: i,
      _id: i,
    };
    const res = writer.write(guitar);
    if (res instanceof Promise) {
      await res;
    }
  }
})();
const end = now();

/* const writer = csvWriter({ headers: ['name', 'productId', '_id'] });
writer.pipe(fs.createWriteStream(path.resolve('database', 'seedFiles', 'test.csv')), { flags: 'a' });
const generateGuitarData = async (max) => {
  for (let i = 0; i < max; i += 1) {
    const name = faker.commerce.productName();
    const guitar = {
      name,
      productId: i,
      _id: i,
    };

    writer.write(guitar);
  }
  writer.end();
};
// Track performance:
const start = now();
generateGuitarData(limit);
const end = now(); */

const generateData = (dataSize) => {
  let data = '';
  let _id = 0;
  let review = {
    _id,
    rating: faker.random.number({ min: 1, max: 5 }),
    author: faker.name.findName(),
    date: faker.date.past(),
    // id property might not be used on front end:
    id: faker.random.number({ min: 0, max: 100 }),
    description: faker.lorem.paragraphs(2),
  };
  for (let i = 0; i < dataSize; i += 1) {
    // Reassign _id so that guitar and review are linked
    _id = i;
    if (i % 5 === 0) {
      review = {
        _id,
        rating: faker.random.number({ min: 1, max: 5 }),
        author: faker.name.findName(),
        date: faker.date.past(),
        // id property may not be used on front end:
        id: faker.random.number({ min: 0, max: 100 }),
        description: faker.lorem.paragraphs(2),
      };
    }
    const guitar = {
      name: faker.commerce.productName,
      productId: i,
      _id: i,
    };
    // Commas for easy parsing
    data += `${JSON.stringify(review)}, ${JSON.stringify(guitar)}, `;
  }

  // Clear file first
  fs.writeFile('database/seedFiles/test.txt', '', (err) => {
    if (err) {
      throw err;
    }
    console.log('File Cleared!'.blue);
    fs.writeFile('database/seedFiles/test.txt', data, (error) => {
      if (error) {
        throw error;
      }
      const stats = fs.statSync('database/seedFiles/test.txt');
      const fileSizeInBytes = stats.size;
      console.log(`The file has been saved! File size is ${fileSizeInBytes / 1000000.0} MBs`.red);
    });
  });
};

/* let data = '';
let _id = 0;
let review = {
  _id,
  rating: faker.random.number({ min: 1, max: 5 }),
  author: faker.name.findName(),
  date: faker.date.past(),
  // id property might not be used on front end:
  id: faker.random.number({ min: 0, max: 100 }),
  description: faker.lorem.paragraphs(2),
};
const fileWriteStream = fs.createWriteStream(path.resolve('database', 'seedFiles', 'test.txt'));
for (let i = 0; i < 100; i += 1) {
  // Reassign _id so that guitar and review are linked
  _id = i;
  if (i % 5 === 0) {
    review = {
      _id,
      rating: faker.random.number({ min: 1, max: 5 }),
      author: faker.name.findName(),
      date: faker.date.past(),
      // id property may not be used on front end:
      id: faker.random.number({ min: 0, max: 100 }),
      description: faker.lorem.paragraphs(2),
    };
  }
  const guitar = {
    name: faker.commerce.productName,
    productId: i,
    _id: i,
  };
  // Commas for easy parsing
  fileWriteStream.write(`${JSON.stringify(review)}, `);
} */

// generateData(limit);

console.log(`generateData() took ${end - start} milliseconds`.green);
