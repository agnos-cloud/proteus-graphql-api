import { Plan } from "@prisma/client";
import { GraphQLContext } from "@types";
import { ObjectID } from "bson";
import { GraphQLError } from "graphql";
import { authenticateContext } from "../../../auth";
import rules from "../../../rules";
import { getCharacterResponse } from "../../../utils/character";
import { conversationPopulated } from "../../conversation/types";
import { CreateEmbeddingFromTextArgs } from "../types";
import { getEmbedding } from "../../../utils/openai";

export default {
    createEmbeddingFromText: async (_: any, args: CreateEmbeddingFromTextArgs, context: GraphQLContext): Promise<boolean> => {
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
                const rawPara = rawParas[i].trim().replaceAll("\n", " ").replace(/\r/g, "");

                // Check of it is a question and has greater length than minimum
                if (rawPara.charAt(rawPara.length - 1) != "?") {
                    if (rawPara.split(/\s+/).length >= min_para_words) {
                        paras.push(rawPara);
                    }
                }
            }

            const countParas = paras.length;

            const response = await getEmbedding(paras, { apiKey: character.org.openaiApiKey });
            if (response.data.length >= countParas) {
                for (let i = 0; i < countParas; i++) {
                    const embedding = response.data[i].embedding;
                    const para = paras[i];

                    // TODO: store embedding in pinecone db
                }
                // TODO: put all embeddings (or just their db IDS) in an embset
                // publish the embset
                // pubsub.publish("EMBSET_CREATED", {
                //     embsetCreated: embset,
                // });
            }
        } catch (error) {
            if (error.response) {
                throw new GraphQLError(error.response.data);
            }
            throw new GraphQLError(error.message);
        }

        return true;
    }
};
