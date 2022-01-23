// Hello Order - our first SAP Graph extension app

const express = require("express");
const Graph = require("./graph");
const Auth = require("./auth");
const app = express();
const port = 3003;

const auth = new Auth();

app.use(auth.getMiddleware());
const graph = new Graph(auth);

// ------------------    1) get and display a list of SalesOrders   ------------------
app.get("/", async (req, res) => {
  const Orders = await graph.get(req, "sap.graph/SalesOrder", "$top=20");
  const qlist = Orders.value
    .map(
      (q) =>
        `<a href="/Order/${q.id}">${q.id}</a> ${q.soldToParty} ${q.netAmount} ${q.netAmountCurrency}<br />`
    )
    .join("");
  res.send(` <h1>Hello Orders</h1> ${qlist} `);
});

// ------------------ 2) show one Order and its items ------------------
app.get("/Order/:id", async (req, res) => {
  const id = req.params.id;
  const singleOrder = await graph.get(
    req,
    `sap.graph/SalesOrder/${id}`,
    "$expand=items&$select=items"
  );
  const allItemLinks = singleOrder.items
    .map(
      (item) =>
        `<p><a href="/Order/${id}/item/${item.itemId}"><button>Product details for item ${item.itemId}: ${item.product}</button></a></p>`
    )
    .join("");
  res.send(`
      <h1>SalesOrder - Detail</h1>
      <h4><code>id: ${id}</code></h4>
      ${allItemLinks}
    `);
});

// ------------------ 3) navigate to the product details for an item in the Order ------------------
app.get("/Order/:id/item/:itemId", async (req, res) => {
  const id = req.params.id;
  const itemId = req.params.itemId;
  const product = await graph.get(
    req,
    `sap.graph/SalesOrder/${id}/items/${itemId}/_product`,
    "$expand=distributionChains"
  );
  res.send(`
      <h1>Product Detail</h1>
      <h4><code>For SalesOrder ${id} and item ${itemId}</code></h4>
      <pre><code>${JSON.stringify(product, null, 2)}</code></pre>
    `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
