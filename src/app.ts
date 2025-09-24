import express,{ Application, Request, Response } from "express";
import { prisma } from "./prisma";
import morgan from "morgan";

const app : Application = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/",(req : Request,res : Response)=>{
    res.send("Hello World");
});

// POST route to create a new user
app.post("/create", async (req: Request, res: Response) => {
   console.log(req.body);
    const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }


  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    // Handle unique constraint violation
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000,()=>{
    console.log("Server is running on port 3000");
});
