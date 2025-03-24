import express from "express";
import axios from "axios";




const app = express();
const PORT = process.env.PORT || 3039;
const API_URL = "http://localhost:3040"



app.set("view engine", "ejs");

   
app.use(express.static(("public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//GET here...

app.get("/", async (_, res) => {
    const response = await axios.get(`${API_URL}/notes`)
    res.render("index.ejs", {notes: response.data})
})


//Post here...

app.post("/add-note", async (req, res) => {
    await axios.post(`${API_URL}/notes`, req.body)
    res.redirect("/")
})



//Edit here...

app.post("/edit-note/:id", async (req, res) => {

    const id = req.params.id;
    await axios.put(`${API_URL}/notes/${id}`, req.body);
    res.redirect("/");
})


// Delete here

app.post("/delete-note/:id", async (req, res) => {
    const id = req.params.id;
    await axios.delete(`${API_URL}/notes/${id}`)
    res.redirect("/")
})




app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});