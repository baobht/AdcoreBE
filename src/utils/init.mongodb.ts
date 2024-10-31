"use strict";

const mongoose = require("mongoose");
class Database {
  static instance: any;
  
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGO_URI, { maxPoolSize: 50 })
      .then(() => console.log("Connected successfully"))
      .catch(() => console.log("Error"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
