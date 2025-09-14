import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogs = [];

//--------------------------------------------get
app.get("/", (req, res) => {
    res.render("index.ejs", { blogs: blogs });
});

app.get("/edit/:id", (req, res) => {
    let blog = blogs.find(b => b.blogID === Number(req.params.id));

    if (!blog) {
        return res.status(404).send("Blog not found");
    }

    res.render("edit.ejs", { blog: blog });
});

//-------------------------------------------post
app.post("/submit", (req, res) => {
    let newBlog = {
        blogID: Date.now(),
        bloggerName: req.body["bloggerName"],
        timeCreated: new Date(),
        blogTitle: req.body["blogTitle"],
        blogContent: req.body["blogContent"]
    };

    blogs.unshift(newBlog);
    res.render("index.ejs", { blogs: blogs });
});

app.post("/edit", (req, res) => {
    let {blogID, action} = req.body;

    if (action === 'Delete')
    {
        blogs = blogs.filter(item => item.blogID !== Number(blogID));
        res.render("index.ejs", { blogs: blogs });
    }

    if (action === 'Edit') {
        res.redirect(`/edit/${blogID}`);
    }
});

app.post("/edit/:id", (req, res) => {
    let { blogTitle, bloggerName, blogContent } = req.body;

    let blog = blogs.find(b => b.blogID === Number(req.params.id));
    if (blog) {
        blog.blogTitle = blogTitle;
        blog.bloggerName = bloggerName;
        blog.blogContent = blogContent;
    }

    res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}.`)
});