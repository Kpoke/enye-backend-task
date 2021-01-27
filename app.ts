import * as express from "express";
import * as cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use((error, req, res, next) => {
  const response = {
    status: "error",
    message: error.message.includes("Unexpected token ")
      ? `Invalid JSON payload passed.`
      : `${error.message}.`,
  };
  res.status(error.status || 500).json(response);
});

app.get("/api/rates", async (req: express.Request, res: express.Response) => {
  const base = req.query.base as string;
  const currency = req.query.currency as string;

  try {
    const response = await axios.get(
      `https://api.exchangeratesapi.io/latest?base=${base}&symbols=${currency}`
    );
    const results = {
      base,
      date: response.data.date,
      rates: response.data.rates,
    };
    res.send({ results });
  } catch (e) {
    res.status(400).send(e.response.data);
  }
});

app.get("/*", (req, res) => {
  const response = {
    status: "error",
    message: `Endpoint not found.`,
  };
  res.status(404);
  res.json(response);
});

app.listen(port, () => {
  console.log("server up and running");
});
