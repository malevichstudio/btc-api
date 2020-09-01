import grpc from 'grpc';
import * as protoLoader from "@grpc/proto-loader";
import routes from "./routes";
import workers from "./workers";

// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync(
    './src/proto/server.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// The protoDescriptor object has the full package hierarchy
const BillingService = protoDescriptor.billing.BillingService;

const server = new grpc.Server();
server.addService(BillingService.service, routes);
server.bind('0.0.0.0:60000', grpc.ServerCredentials.createInsecure());
server.start();

workers().catch(e => console.error(e));