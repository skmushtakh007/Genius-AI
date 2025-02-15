import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration } from "openai";
import { OpenAIApi } from 'openai'
//const {Configuration,OpenAIApi}=require('openai')
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";



const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { messages } = body;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!configuration.apiKey) {
            return new NextResponse("OpenAI API key not configured", { status: 500 })
        }
        if (!messages) {
            return new NextResponse("Messages are required", { status: 400 })
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription();

        if (!freeTrial && !isPro) {
            return new NextResponse("Free trial has expired. Please upgrade to pro.", { status: 403 });
        }
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages
        });
        if (!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(response.data.choices[0].message);

    } catch (error) {
        console.log("[CONVERSATIONAL_ERROR]", error);
        return new NextResponse("Internal error", { status: 500 })
    }
}