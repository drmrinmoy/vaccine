import { NextResponse } from "next/server"
import OpenAI from 'openai'
import { cookies } from 'next/headers'

// Define message interface
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Initialize the DeepSeek client with your API key
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  maxRetries: 3,
  timeout: 60000
})

// Retry function with exponential backoff
async function retryWithExponentialBackoff(fn: () => Promise<any>, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error: any) {
      console.error(`Retry attempt ${i + 1}/${maxRetries} failed:`, {
        error: error.message,
        type: error.type,
        status: error.status,
        stack: error.stack
      })
      
      if (i === maxRetries - 1) throw error
      const delay = Math.min(1000 * Math.pow(2, i), 10000)
      console.log(`Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function POST(req: Request) {
  const requestId = Math.random().toString(36).substring(7)
  console.log(`[${requestId}] Processing vaccine AI request`)
  
  try {
    const body = await req.json()
    const { messages } = body
    
    if (!messages?.length) {
      console.warn(`[${requestId}] Invalid messages format`)
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 })
    }

    const lastMessage = messages[messages.length - 1]
    console.log(`[${requestId}] Processing message:`, {
      content: lastMessage.content.substring(0, 100) + '...',
      totalMessages: messages.length
    })
    
    // Generate response with retry
    const completion = await retryWithExponentialBackoff(async () => {
      return await openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an advanced Vaccine AI assistant. Your primary focus is on providing accurate, evidence-based information about vaccines, immunizations, and related health topics according to NIS India, IAP India.

            Guidelines: (
            if question is not related to vaccine, then write - I am sorry, I am not able to answer questions not related to vaccine.
            )
            1. Provide accurate, scientifically-supported information about vaccines, dont write cosult doctor, instead write - verify sources before prescribing.
            2. Focus on answering questions related to:
               - Vaccine schedules and timing
               - Vaccine types and mechanisms
               - Side effects and safety information
               - Recommendations for specific populations
               - General vaccine education
            3. Use appropriate emoji and formatting to enhance readability
            4. Be concise but thorough in your explanations.
            5. When appropriate, mention reliable sources like IAP, NIS, Government of India, etc.
            6. Always clarify that you are providing general information, not personalized medical advice
            7. For sensitive topics, present balanced, evidence-based perspectives
            8. Use markdown formatting to structure your answers, including **bold** for emphasis, lists with - for bullet points, and headings with #
            9. For tables, use markdown table syntax
            10. For code blocks or citations, use appropriate markdown formatting
            
            Use these emojis appropriately:
            💉 Vaccines | 🛡️ Immunity | ⏰ Schedules | ℹ️ Information | ⚠️ Warnings | 👶 Children | 👨‍⚕️ Healthcare`
          },
          ...messages.slice(-5).map((m: Message) => ({ role: m.role, content: m.content })) // Only use last 5 messages for context
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      })
    })

    console.log(`[${requestId}] Starting stream response`)

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }

          console.log(`[${requestId}] Stream completed successfully`)
          controller.close()
        } catch (error: any) {
          console.error(`[${requestId}] Stream error:`, {
            error: error.message,
            type: error.type,
            status: error.status,
            stack: error.stack
          })
          
          const errorMessage = 'I apologize, but I encountered an error. Please try again or rephrase your question.'
          controller.enqueue(encoder.encode(errorMessage))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error(`[${requestId}] Chat error:`, {
      error: error.message,
      type: error.type,
      status: error.status,
      stack: error.stack
    })
    return NextResponse.json({ error: "Error processing chat request" }, { status: 500 })
  }
} 