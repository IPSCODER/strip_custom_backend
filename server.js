const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
// This is your test secret API key.

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))

const stripe = require("stripe")('sk_test_51Nnz1ASDTdclJtfgBhdXYXT5FiSJcqVu4sMJyFt3olCg6AYVUdFIzLLkOefULbw5XKeFtOVQXC6ziWsdGyLfUWsT00VWW2utEc');

app.use(express.static("public"));
app.use(express.json());

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return items * 100;
};

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const prc = items.price
  const name = items.name;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(prc),
    currency: "inr",
    description:`${name}`,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });
  console.log(paymentIntent);

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));