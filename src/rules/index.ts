import { Plan } from "@prisma/client";

const rules = {
    maxConversationMessagesLength: (plan: Plan) => {
        switch (plan) {
            case Plan.ADVANCED:
                return 50;
            case Plan.PRO:
                return 20;
            default:
                return 1;
        }
    },
    maxInstructionLength: (plan: Plan) => {
        switch (plan) {
            case Plan.ADVANCED:
                return 5000;
            case Plan.PRO:
                return 2000;
            default:
                return 1000;
        }
    }
};

export default rules;
