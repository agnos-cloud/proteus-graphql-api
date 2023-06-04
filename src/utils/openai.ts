import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export type OpenaiOptions = {
    apiKey: string;
    model?: string;
    context?: string;
};

/*
plans:
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
    fine-tuning:
        basic: can only fine-tune on a single prompt
        production: can fine-tune with JSONL files
        advanced: can fine-tune with non-JSONL files, website URLs, and other sources
    metrics:
        basic: can only see basic metrics (e.g. number of conversations, number of messages, number of users) for a very short period of time (e.g. 1 day)
        production: can also see advanced metrics (e.g. number of messages per user, number of messages per conversation) for longer period of time (e.g. 1 week)
                    can also export metrics (e.g. as CSV)
        advanced: can also see custom metrics
                    can also see metrics for a custom period of time
                    can also export metrics automatically via API calls
*/

export async function getEmbeddings(content: string, options: OpenaiOptions): Promise<number[]> {
    const configuration = new Configuration({
        apiKey: options.apiKey,
    });
    const ai = new OpenAIApi(configuration);

    const embedding = await ai?.createEmbedding({
        model: "text-embedding-ada-002",
        input: options.context,
        user: "<user email/>id?>"
    })
    console.log(embedding.data.data[0].embedding);
    return embedding.data.data[0].embedding;
}

export async function getResponse(prompt: string, options: OpenaiOptions): Promise<string> {
    const configuration = new Configuration({
        apiKey: options.apiKey,
    });
    const ai = new OpenAIApi(configuration);

    const completion = await ai.createCompletion({
        // see https://beta.openai.com/docs/api-reference/create-completion for more options
        model: "text-davinci-003",
        prompt: `${options.context}\n${prompt}`,
        max_tokens: 200,
        // stream: true,
        // user: <user email?>,
    });

    console.log(completion.data)

    return completion.data.choices[0].text;
}

export async function getChatResponse(messages: ChatCompletionRequestMessage[], options: OpenaiOptions): Promise<string> {
    const configuration = new Configuration({
        apiKey: options.apiKey,
    });
    const ai = new OpenAIApi(configuration);

    // see https://platform.openai.com/docs/api-reference/chat/create
    const chat = await ai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 200,
    });

    console.log(chat.data)

    return chat.data.choices[0].message.content;
}
