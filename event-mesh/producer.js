// Based on the SAP Tutorial:
// https://developers.sap.com/tutorials/cp-enterprisemessaging-nodejs-producing-app.html
"use strict";
require("dotenv").config();
//------------------------------------------------------------------------------------------------------------------
//  Basic setup in respect to modules, messaging settings and getting messaging options
//------------------------------------------------------------------------------------------------------------------

const msg = require("@sap/xb-msg");
const env = require("@sap/xb-msg-env");
const xsenv = require("@sap/xsenv");
const service = "rest-client";
const taskList = {
  ProductCreated: {
    topic: "sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Created/v1",
    timerMin: 1,
    timerMax: 11,
  },
  ProductChanged: {
    topic: "sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Changed/v1",
    timerMin: 5,
    timerMax: 8,
  },
};
var counter = 1;
const ProductCreated = {
  type: "sap.s4.beh.product.v1.Product.Created.v1",
  specversion: "1.0",
  source: "sap/S4HANAOD/K8M",
  id: "9d8a6fa2-3bc5-1eef-a7d6-96406c453b5c",
  time: "2024-11-09T16:07:19Z",
  datacontenttype: "application/json",
  data: {
    Product: "TG11",
    ProductType: "HAWA",
    ProductCategory: "",
  },
};
const ProductChanged = {
  type: "sap.s4.beh.product.v1.Product.Changed.v1",
  specversion: "1.0",
  source: "sap/S4HANAOD/K8M",
  id: "9d8a6fa2-3bc5-1eef-a7d6-96406c453b5c",
  time: "2024-11-09T16:07:19Z",
  datacontenttype: "application/json",
  data: {
    Product: "TG11",
    ProductType: "HAWA",
    ProductCategory: "",
  },
};

xsenv.loadEnv();

//------------------------------------------------------------------------------------------------------------------
// Start messaging client
//------------------------------------------------------------------------------------------------------------------

const client = new msg.Client(
  env.msgClientOptions(service, [], ["ProductCreated", "ProductChanged"])
);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 1000;
}

function initTasks(tasks, client) {
  Object.getOwnPropertyNames(tasks).forEach((id) => {
    const task = tasks[id];
    const stream = client.ostream(id);

    const handler = () => {
      console.log(
        "publishing message number " + counter + " to topic " + task.topic
      );
      let payload = {};
      if (
        task.topic ===
        "sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Created/v1"
      ) {
        payload = ProductCreated;
      }
      if (
        task.topic ===
        "sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Changed/v1"
      ) {
        payload = ProductChanged;
      }

      const message = {
        payload: Buffer.from(JSON.stringify(payload)),
      };
      if (!stream.write(message)) {
        console.log("wait");
        return;
      }
      setTimeout(handler, getRandomInt(task.timerMin, task.timerMax));
      counter++;
    };

    stream.on("drain", () => {
      setTimeout(handler, getRandomInt(task.timerMin, task.timerMax));
    });

    setTimeout(handler, getRandomInt(task.timerMin, task.timerMax));
  });
}

//------------------------------------------------------------------------------------------------------------------
// Messaging client handler methods
//------------------------------------------------------------------------------------------------------------------

client
  .on("connected", () => {
    console.log("connected");
    initTasks(taskList, client);
  })
  .on("drain", () => {
    console.log("continue");
  })
  .on("error", (error) => {
    console.log(error);
  });

client.connect();
