// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const data = [];
/**
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).send(data);
  }
  if (req.method === "POST") {
    data.push(req.body);
    res.status(200).send("OK");
  }
  res.status(405).send();
}
