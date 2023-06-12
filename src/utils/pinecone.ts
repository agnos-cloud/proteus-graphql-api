import { PineconeClient, Vector, utils } from "@pinecone-database/pinecone";

const { createIndexIfNotExists, chunkedUpsert } = utils;

let pineconeClient: PineconeClient | null = null;

export const getPineconeClient = async (): Promise<PineconeClient> => {
    if (pineconeClient) {
        return pineconeClient;
    } else {
        pineconeClient = new PineconeClient();

        await pineconeClient.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENVIRONMENT,
        });
    }
    return pineconeClient;
};

export async function saveEmbeddings(embeddings: Vector[]): Promise<boolean> {
    const indexName = process.env.PINECONE_INDEX;
    const pineconeClient = await getPineconeClient();

    /*
    NOTE: text-embedding-ada-002 produces 1536-dimensional embeddings
    See: https://platform.openai.com/docs/guides/embeddings
    */
    await createIndexIfNotExists(pineconeClient, indexName, 1536);

    // Select the target Pinecone index
    const index = pineconeClient.Index(indexName);

    const result = await chunkedUpsert(index, embeddings, "default");

    return result;
}
