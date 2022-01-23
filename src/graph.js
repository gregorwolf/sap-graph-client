const fetch = require("node-fetch");
const credentials = require("./credentials.json");
const apiUrl = credentials.uri;
const dataGraphId = "v1"; // example, modify accordingly

class Graph {
  constructor(auth) {
    this.auth = auth;
    this.apiUrl = apiUrl;
    this.dataGraphId = dataGraphId;
  }

  async get(req, entity, params) {
    const token = this.auth.getToken(req);
    const url = `${this.apiUrl}/${this.dataGraphId}/${entity}${
      params ? `?${params}` : ""
    }`;
    console.log(url); //for debugging
    const options = {
      method: "get",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const response = await fetch(url, options);
    console.log(`${response.status} (${response.statusText})`); // for debugging
    const json = await response.json();
    return json;
  }
}

module.exports = Graph;
