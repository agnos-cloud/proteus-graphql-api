import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CharacterPopulated, CreateCharacterArgs, characterPopulated } from "../types";

export default {
    createCharacter: async (_: any, args: CreateCharacterArgs, context: GraphQLContext): Promise<CharacterPopulated> => {
        const { prisma, session, pubsub } = context;

        await authenticateContext(context);

        const { name, description, orgId } = args.input;
        const character = await prisma.character.create({
            data: {
                name,
                description,
                org: {
                    connect: {
                        id: orgId,
                    },
                },
            },
            include: characterPopulated,
        });

        pubsub.publish("CHARACTER_CREATED", {
            characterCreated: character,
        });

        return character;
    }
};
