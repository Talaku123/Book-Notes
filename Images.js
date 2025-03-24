
import express from "express"
import cors from 'cors'
import pg from "pg"
import fetch from "node-fetch";



const app = express()
const PORT = process.env.PORT || 3040




app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set("view engine", "ejs")

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Book Notes",

    password: "Pgtalaku24#",
    port: 5432,
})

  db.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Error connecting to PostgreSQL", err));


let lastId = 1
    
const notes = [
  {
    id: 1,
    title: "First Note",
    body: " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate libero harum deleniti nostrum ipsam esse illo, adipisci earum in vero perferendis similique. Voluptate deserunt omnis ipsum quo soluta facere dolorem.",
    img_url: "https://covers.openlibrary.org/b/id/12547191-L.jpg",
  },
];
 
  
async function fetchImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
}
(async () => {
  await fetchImage(
    "https://covers.openlibrary.org/b/id/12547191-L.jpg"
  );
})();



app.get("/notes", (req, res) => {
  res.json(notes);
});


app.get("/notes/:id", async (req, res) => {
  const note = notes.find((n) => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }
  try {
    const result = await db.query("SELECT * FROM notes WHERE id = $1", [req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving note");
  }
});

// Post Event Here

app.post("/notes", async (req, res) => {

  const { title,body,img_url} = req.body;
   
    try {
        const result = await db.query("INSERT INTO notes(title, body,img_url) VALUES ($1, $2, $3) RETURNING *", [title, body,img_url]);
        const newNote = result.rows[0]; 
        notes.push(newNote);
        lastId = newNote.id;
        res.json(newNote);
    } catch (error) {
        console.log(error);
        res.status(500).send("error is found");
    }
});


// Event event here


app.put("/notes/:id", async (req, res) => {
  
  const id = parseInt(req.params.id);

  const { title, body, img_url } = req.body;
 
  try {
    const result = await db.query(
      "UPDATE notes SET title= $1, body= $2, img_url= $3 WHERE id = $4 RETURNING *",
      [title, body, img_url, id])
    
    const updatedNote = result.rows[0]
    const noteIndex = notes.findIndex((note) => note.id === id)
    if (noteIndex !== -1) {
      notes[noteIndex]= updatedNote
    }
    res.json(updatedNote)
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err.message}`);
  }
});


// Delete event here

app.delete("/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);
 
  try {
    await db.query("DELETE FROM notes WHERE id = $1", [id]);
    const noteIndex = notes.findIndex((note) => note.id === id);
    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1);
    }
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err.message}`);
  }
});




app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});






