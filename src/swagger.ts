import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Collage API",
      version: "1.0.0",
      description: "Documentation for the Swagger Express API of collage app",
    },
  },
  apis: ["./routes/*.js"], // Path to your API routes
};

const specs = swaggerJSDoc(options);

export default specs;
