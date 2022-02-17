import express, { Request, Response, NextFunction } from "express";
import { sign, verify } from "jsonwebtoken";

const SECRET_KEY = "abc"
const PORT = Number(process.env.PORT) || 6001;

const app = express();

app.use(express.json());

function authentication(req: Request, res: Response, next: NextFunction) {
  const { headers: { authorization } } = req;
  if (!authorization) {
    return res.status(401).send("Not authorized")
  }
  try {
    const verified = verify(authorization, SECRET_KEY)
    if (!verified) {
      return res.status(401).send("Invalid token")
    }
    next();
  } catch (e) {
    return res.status(401).send(e)
  }
}

// app.use(authentication)
function privateController(req: Request, res: Response) {
  console.log(req.headers)
  console.log("i am private")
  res.status(200).json({ status: "success" })
}

app.get("/", (req, res) => {
  res.status(200).send("Auth 세미나입니다. /private /public /login 을 사용해주세요.")
})

app.get("/private", authentication, privateController)

app.get("/public", (req, res) => {
  console.log("i am public")
  res.status(200).json({ status: "success" })
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const token = sign({ username }, SECRET_KEY);
  res.status(200).json({ token })
})

app.listen(PORT, () => {
  console.log(`listening http://localhost:${PORT}`)
})

export { app };