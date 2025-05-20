const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage route to display Cars custom object data
app.get("/", async (req, res) => {
  const carsEndpoint = "https://api.hubapi.com/crm/v3/objects/2-45006147";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    // Get all car records with their properties
    const resp = await axios.get(carsEndpoint, {
      headers,
      params: {
        properties: "name,color,year,manufacturer",
        limit: 100,
      },
    });
    const data = resp.data.results;
    res.render("homepage", {
      title: "Cars | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching car data");
  }
});

// ROUTE 2 - Form route to create new Cars records
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// ROUTE 3 - Process form data and create new Cars record
app.post("/update-cobj", async (req, res) => {
  const createEndpoint = "https://api.hubapi.com/crm/v3/objects/2-45006147";
  const carData = {
    properties: {
      name: req.body.name,
      color: req.body.color,
      year: req.body.year,
      manufacturer: req.body.manufacturer,
    },
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createEndpoint, carData, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating car record");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
