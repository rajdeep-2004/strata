import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantClient = new QdrantClient({
  url: "https://77a2ac9b-ac21-4433-8d4a-60bab7696e7e.us-west-2-0.aws.cloud.qdrant.io",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6N2JiOTA5ZDYtMmNlYS00YzIyLWJlMmItM2U5NTZiMWVjZWQ3In0.U1Rsr4Vr07QXgBavBwexBW5ZKS3fIu83q3r7fBbxZgg",
});

export default qdrantClient;
