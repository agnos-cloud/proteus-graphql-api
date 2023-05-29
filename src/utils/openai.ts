import { Configuration, OpenAIApi } from "openai";

export type OpenaiOptions = {
    apiKey: string;
    model?: string;
    context: string;
};

/*
plans:
    memory:
        basic: remembers only immediate prompt
        production: remembers all messages (or last few messages) in conversation
        advanced: remembers all messages in conversation
    knowledge:
        basic: a simple text box of not more than 1000? characters
        production: can also upload a file of not more than 1MB?
                    an also crawl a website and use that as knowledge
        advanced: can also upload a file of not more than 10MB?
                  can also crawl a website and use that as knowledge
                  can also use a database as knowledge
                  can also use an API as knowledge
    knowledge update:
        basic: can only update knowledge manually
        production: can also update knowledge automatically after fixed interval (e.g. crawl a website every 7 days)
        advanced: can also update knowledge automatically after custom interval (e.g. crawl a website every 1 hour)
    capabilities:
        basic: can only respond to text
        production: can also respond to images
        advanced: can also respond to audio
                    can also respond to video
                    can also respond to a combination of text, images, audio, and video
    responses:
        basic: can only respond with text
        production: can also respond with images
                    can also response with action buttons
        advanced: can also respond with audio
                    can also respond with video
                    can also respond with a combination of text, images, audio, and video
                    can also respond with custom widgets
    response length:
        basic: can only respond with a single message of not more than 1000? characters
        production: can also respond with multiple messages of not more than 1000? characters each
        advanced: can also respond with a single message of not more than 10000? characters
                    can also respond with multiple messages of not more than 10000? characters each
    actions:
        basic: can make an API call
    fine-tuning:
        basic: can only fine-tune on a single prompt
        production: can fine-tune with JSONL files
        advanced: can fine-tune with non-JSONL files
    widgets:
        basic: can only have an API key
        production: can also have built-in widgets (e.g. chat boxes)
        advanced: can also have custom widgets
    metrics:
        basic: can only see basic metrics (e.g. number of conversations, number of messages, number of users) for a very short period of time (e.g. 1 day)
        production: can also see advanced metrics (e.g. number of messages per user, number of messages per conversation) for longer period of time (e.g. 1 week)
                    can also export metrics (e.g. as CSV)
        advanced: can also see custom metrics
                    can also see metrics for a custom period of time
                    can also export metrics automatically via API calls
    costs:
        basic: $10 per month
        production: $30 per month
        advanced: $100 per month
        enterprise: contact sales
*/

export async function getAiResponse(prompt: string, options: OpenaiOptions): Promise<string> {
    const configuration = new Configuration({
        apiKey: options.apiKey,
    });
    const ai = new OpenAIApi(configuration);

    // const embedding = await ai?.createEmbedding({
    //     model: "text-embedding-ada-002",
    //     input: options.context,
    //     user: "<user email/>id?>"
    // })
    // console.log(embedding.data.data[0].embedding);

    const completion = await ai.createCompletion({
        // see https://beta.openai.com/docs/api-reference/create-completion for more options
        model: "text-davinci-003",
        prompt: `${options.context}\n${prompt}`,
        max_tokens: 200,
        // stream: true,
        // user: <user email?>,
    });

    // TODO: we should probably use the chat endpoint instead of the completion endpoint
    // see https://platform.openai.com/docs/api-reference/chat/create
    // we should get the last few messages (or all messages) from the conversation and use them in "messages"
    // const chat = await ai.createChatCompletion({
    //     model: "gpt-3.5-turbo",
    //     messages: [
    //         {
    //             role: "user",
    //             content: options.context,
    //             name: "User"
    //         },
    //         {
    //             role: "system",
    //             content: options.context,
    //             name: "User"
    //         },
    //     ],
    //     max_tokens: 200,
    // });

    console.log(completion.data)

    return completion.data.choices[0].text;
}
