const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
// const routes = require("./routes");

const PORT = process.env.PORT || 3001;
// create a new apollo server and pass in the schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();

  // integrate the Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
};

// app.use(routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "./public/404.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
