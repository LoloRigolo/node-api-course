const { readDB, writeDB } = require("./db");

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const getAllBooks = async (req, res) => {
  try {
    const data = await readDB();
    let books = data.books;
    if (req.query.available !== undefined) {
      const isAvailable = req.query.available === "true";
      books = books.filter((book) => book.available === isAvailable);
    }
    sendJson(res, 200, {
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("Error when read database:", error);
    sendJson(res, 500, { message: "Server Error" });
  }
};

const getBookById = async (req, res) => {
  try {
    const data = await readDB();
    data.books.forEach((book) => {
      if (req.params.id === book.id.toString()) {
        sendJson(res, 200, {
          success: true,
          data: book,
        });
      }
    });
    return sendJson(res, 404, { succes: false, error: "Book not find" });
  } catch (error) {
    console.error("Error when read database:", error);
    sendJson(res, 500, { message: "Server Error" });
  }
};

const createBook = async (req, res) => {
  if (!req.body.title || !req.body.year || !req.body.author) {
    return sendJson(res, 400, {
      success: false,
      error: "Les champs title, author et year sont requis",
    });
  }
  try {
    const newFilm = req.body;
    const data = await readDB();
    newFilm.id = (data.books.length + 1).toString();
    newFilm.available = true;
    console.log(typeof data);
    data.books.push(newFilm);
    await writeDB(data);
    return sendJson(res, 201, {
      success: true,
      data: newFilm,
    });
  } catch (error) {
    console.error("Error when read database:", error);
    return sendJson(res, 500, { message: "Server Error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const data = await readDB();
    const index = data.books.findIndex(
      (book) => req.params.id === book.id.toString(),
    );

    if (index === -1) {
      return sendJson(res, 404, {
        succes: false,
        error: "Book not find",
      });
    }

    const deletedBook = data.books.splice(index, 1);
    await writeDB(data);

    return sendJson(res, 200, {
      success: true,
      data: deletedBook,
    });
  } catch (error) {
    console.error("Error when read database:", error);
    return sendJson(res, 500, { message: "Server Error" });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
};
