import * as express from "express";
import * as cors from "cors";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/api/rates", async (req: express.Request, res: express.Response) => {
  const base: string = req.query.base as string;
  const currency: string = req.query.currency as string;

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

app.listen(port, () => {
  console.log("server up and running");
});
