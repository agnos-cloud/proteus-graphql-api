import { Vector } from "@pinecone-database/pinecone";
import { Knowledge } from "@prisma/client";
import { GraphQLContext } from "@types";
import { ObjectID } from "bson";
import { GraphQLError } from "graphql";
import { authenticateContext } from "../../../auth";
import { getEmbedding } from "../../../utils/openai";
import { saveEmbeddings } from "../../../utils/pinecone";
import { CreateKnowledgeFromTextArgs, KnowledgeSourceType } from "../types";

export default {
    createKnowledgeFromText: async (_: any, args: CreateKnowledgeFromTextArgs, context: GraphQLContext): Promise<Knowledge> => {
        const { prisma, pubsub, session } = context;

        await authenticateContext(context);

        try {
            const { characterId, content } = args.input;

            const character = await prisma.character.findUnique({
                where: {
                    id: characterId,
                },
                include: {
                    org: {
                        select: {
                            id: true,
                            name: true,
                            openaiApiKey: true,
                        },
                    },
                },
            });

            if (!character) {
                throw new GraphQLError("Character not found");
            }
            if (!character.org.openaiApiKey) {
                throw new GraphQLError("OpenAI API key not found");
            }

            const min_para_words = 5; // We will ignore paragraphs that have less than 5 words

            // Paragraph store after splitting
            const paras = [];

            // Split text into paragraphs
            const rawParas = content.split(/\n\s*\n/);

            // Some more formatting and pushing each paragraph to paras[]
            for (let i = 0; i < rawParas.length; i++) {
                // replace newlines with spaces
                // see: https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/embeddings?tabs=console#replace-newlines-with-a-single-space
                const rawPara = rawParas[i].trim().replaceAll("\n", " ").replace(/\r/g, "");

                // Check of it is a question and has greater length than minimum
                if (rawPara.charAt(rawPara.length - 1) != "?") {
                    if (rawPara.split(/\s+/).length >= min_para_words) {
                        paras.push(rawPara);
                    }
                }
            }

            if (paras.length === 0) {
                throw new GraphQLError("Could not create knowledge from text");
            }

            const countParas = paras.length;

            const response = await getEmbedding(paras, { apiKey: character.org.openaiApiKey });
            if (response.data.length >= countParas) {
                const embeddings: Vector[] = [];
                for (let i = 0; i < countParas; i++) {
                    const embedding = response.data[i].embedding;
                    const para = paras[i];
                    embeddings.push({
                        id: new ObjectID().toString(),
                        metadata: {
                            content: para,
                            characterId,
                            orgId: character.org.id,
                        },
                        values: embedding,
                    });
                }
                const result = await saveEmbeddings(embeddings);

                if (!result) {
                    throw new GraphQLError("Error saving embeddings");
                }

                const knowledge = await prisma.knowledge.create({
                    data: {
                        // characterId: character.id,
                        character: {
                            connect: {
                                id: character.id,
                            },
                        },
                        description: content.substring(0, 400) + (content.length > 400 ? "..." : ""),
                        embeddings: embeddings.map((embedding) => embedding.id),
                        name: "Raw Text",
                        source: content,
                        sourceType: KnowledgeSourceType.TEXT,
                    },
                    include: {
                        character: {
                            select: {
                                id: true,
                                name: true,
                                orgId: true,
                                org: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                });
                pubsub.publish("KNOWLEDGE_CREATED", {
                    knowledgeCreated: knowledge,
                });

                return knowledge;
            }
        } catch (error) {
            if (error.response) {
                throw new GraphQLError(error.response.data);
            }
            throw new GraphQLError(error.message);
        }
    }
};
