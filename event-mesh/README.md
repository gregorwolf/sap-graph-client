# SAP Event Mesh

Initial data load using SAP Event Mesh

```mermaid
sequenceDiagram
%% participants
participant Admin as Admin
participant InitialLoadApp as Initial Load App
participant Graph as Graph
participant EventMesh as Event Mesh
participant Middleware as Middleware
participant TargetApp as Target App

Admin->>InitialLoadApp: triggers load
InitialLoadApp->>Graph: Requests $count of Business Object
Graph->>InitialLoadApp: Returns $count
loop Until all entities are transferred
    InitialLoadApp->>Graph: Read entities in packages
    Graph->>InitialLoadApp: Returns first package of entities
    loop Through all entities of package
        InitialLoadApp->>EventMesh: Send create event for each entity
        EventMesh->>Middleware: Send event via queue
        Middleware->>Graph: Request entity details
        Graph->>Middleware: Returns entity details
        Middleware->>TargetApp: Check if entity exist
        TargetApp->>Middleware: Response with status
        Middleware->>TargetApp: Send create or update of entity
        TargetApp->>Middleware: Response with status
    end
end
```

.env Template:

```
XBEM_INPUT_X=ProductCreated
SAP_XBEM_BINDINGS='{
    "inputs": {
        "ProductCreated": {
            "service": "rest-client",
            "address": "queue:sap/rest/client/ProductCreated",
            "reliable": true
        }
    },
    "outputs": {
        "ProductCreated" : {
            "service": "rest-client",
            "address": "topic:sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Created/v1",
            "reliable": false
        },
        "ProductChanged" : {
            "service": "rest-client",
            "address": "topic:sap/S4HANAOD/K8M/ce/sap/s4/beh/product/v1/Product/Changed/v1",
            "reliable": false
        }
    }
}'
VCAP_SERVICES='{
    "enterprise-messaging": [
        {
            "label": "enterprise-messaging",
            "provider": null,
            "plan": "default",
            "name": "rest-client",
            "tags": [
                "enterprise-messaging"
            ],
            "instance_guid": "6a1ca408-e439-4f46-a765-dea57b698064",
            "instance_name": "rest-client",
            "binding_guid": "5978cea2-c341-48dc-bbe6-8b8eb8300c6b",
            "binding_name": null,
            "credentials": {
            },
            "syslog_drain_url": null,
            "volume_mounts": []
        }
    ]
}'
```
