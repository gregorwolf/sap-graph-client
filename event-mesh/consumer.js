// Based on the SAP Tutorial:
// https://developers.sap.com/tutorials/cp-enterprisemessaging-nodejs-receiving-app..html
"use strict";
require("dotenv").config();
// console.log(process.env);
//------------------------------------------------------------------------------------------------------------------
// Basic setup in respect to modules, messaging settings and getting messaging options
//------------------------------------------------------------------------------------------------------------------

const msg = require("@sap/xb-msg");
const msgenv = require("@sap/xb-msg-env");

const inputX = process.env.XBEM_INPUT_X;
const reconnect_retry_ms = process.env.RECONNECT_RETRY_MS;

// Get options from CF environment
const options = msgenv.msgClientOptions("rest-client", [inputX], []);

//------------------------------------------------------------------------------------------------------------------
// Start messaging client
//------------------------------------------------------------------------------------------------------------------

// Client for SAP Event Mesh Service instance
const client = new msg.Client(options);

//------------------------------------------------------------------------------------------------------------------
// Messaging client handler methods
//------------------------------------------------------------------------------------------------------------------

client
  .on("connected", () => {
    console.log("connected to SAP Event Mesh service");
  })
  .on("error", (err) => {
    console.log("error on SAP Event Mesh service occurred " + err);
  })
  .on("disconnected", (hadError) => {
    console.log(
      "connection to SAP Event Mesh service lost, trying to reconnect in " +
        reconnect_retry_ms +
        " ms"
    );
    setTimeout(() => client.connect(), reconnect_retry_ms);
  });

//------------------------------------------------------------------------------------------------------------------
// Input stream handler methods
//------------------------------------------------------------------------------------------------------------------

client
  .istream(inputX)
  .on("subscribed", () => {
    console.log("subscribed to " + inputX);
  })
  .on("ready", () => {
    console.log("stream ready: " + inputX);
  })
  .on("data", (message) => {
    let topic = "dummy";
    if (message.source) {
      if (typeof message.source === "string") {
        topic = message.source;
      } else if (message.source.topic) {
        topic = message.source.topic;
      }
    }

    //------------------------------------------------------------------------------------------------------------------
    // Write the message payload to the log file
    //------------------------------------------------------------------------------------------------------------------

    console.log("message received: " + message.payload.toString());
    message.done();
  });

client.connect();
