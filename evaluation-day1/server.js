const http = require("http");
const {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
} = require("./modules/router");
const port = 3000;
const server = http.createServer((req, res) => {
  res.on("finish", () => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} -> ${res.statusCode}`,
    );
  });
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/books" && req.method === "GET") {
    req.query = Object.fromEntries(url.searchParams.entries());
    return getAllBooks(req, res);
  }
  if (url.pathname.startsWith("/books/") && req.method === "GET") {
    const id = url.pathname.split("/")[2];
    req.params = { id };
    return getBookById(req, res);
  }
  if (url.pathname.startsWith("/books/") && req.method === "DELETE") {
    const id = url.pathname.split("/")[2];
    req.params = { id };
    return deleteBook(req, res);
  }
  if (url.pathname === "/books" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        createBook(req, res);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: "Invalid JSON" }));
      }
    });

    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: false, error: "Route non trouvée" }));
});

server.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});
