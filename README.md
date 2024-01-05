# SAP BTP Integration Suite - Graph

## Setup Graph

- Get a SAP BTP Trial Account
- Activate Integration Suite
- Assign yourself the Role Collection `Integration_Provisioner`
- Navigate to the Integration Suite Tenant
- Add the Capability 'API Management' and tick the checkbox for 'API Business Hub Enterprise' which then allows you to also activate 'Graph'
- Assign yourself the Role Collections `Graph.KeyUser` and `GraphNavigator.Viewer`
- Get your api.sap.com APIKey from https://api.sap.com/settings. Import the `API-Sandbox-S4HANACloud` Destination template into your BTP Subaccount
- Maintain the APIKey in the `API-Sandbox-S4HANACloud` Destination using the additional parameter `URL.headers.apikey`
- Now you can Navigate to Integration Suite -> Design -> Graph
- Create a new Graph from File and use `graph/s4hana.json`
- To consume the Graph create an instance of sap-graph with the api plan in your BTP Subaccount
- Create a service key in that instance
- Maintain the credentials in `test/.env` here is the template:

```
graph_clientid=
graph_clientsecret=""
graph_tokenendpoint=
graph_uri=
graph_name=s4hc
```

Test the Graph with the REST Client Scripts for

- OData V4: `test/graph-odata.http`
- GraphQL: `test/graph-graphql.http`

## Client

Based on the blog posts:

- [Part 2: Hello Graph! Write your first SAP Graph application](https://blogs.sap.com/2021/06/15/part-2-hello-graph-write-your-first-sap-graph-application/)
- [Part 3: Use SAP Graph securely with real data – authentication](https://blogs.sap.com/2021/06/25/part-3-use-sap-graph-securely-with-real-data-authentication/)
- [Part 5: Use SAP Graph with your own data](https://blogs.sap.com/2022/01/18/part-5-use-sap-graph-with-your-own-data/)

### Setup

Follow [Part 5: Use SAP Graph with your own data](https://blogs.sap.com/2022/01/18/part-5-use-sap-graph-with-your-own-data/) and download the credentials to **src/credentials.json**. Then you can start with:

```
npm start
```
