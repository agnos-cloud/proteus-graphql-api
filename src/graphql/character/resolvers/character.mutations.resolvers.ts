import { GraphQLContext } from "@types";
import { authenticateContext } from "../../../auth";
import { CharacterPopulated, CreateCharacterArgs, SaveCharacterInstructionArgs, characterPopulated } from "../types";

export default {
    createCharacter: async (_: any, args: CreateCharacterArgs, context: GraphQLContext): Promise<CharacterPopulated> => {
        const { prisma, pubsub } = context;

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
    },
    saveInstruction: async (_: any, args: SaveCharacterInstructionArgs, context: GraphQLContext): Promise<boolean> => {
        const { prisma } = context;

        await authenticateContext(context);

        const { id, instruction, orgId } = args.input;

        await prisma.character.findFirstOrThrow({
            where: {
                id,
                orgId,
            },
        });
        await prisma.character.update({
            where: {
                id,
            },
            data: {
                instruction,
            },
        });

        return true;
    },
};
