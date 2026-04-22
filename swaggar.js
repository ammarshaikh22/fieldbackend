// swagger.js

import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Field Ops API",
    description: "Auto generated docs",
  },
  host: "localhost:7000",
};

const outputFile = "./swagger-output.json";
const routes = ["./main.js"]; // ya app.js jahan routes import hain

swaggerAutogen()(outputFile, routes);