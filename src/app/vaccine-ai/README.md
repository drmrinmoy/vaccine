# Vaccine AI Feature

This feature provides an AI assistant powered by DeepSeek that answers questions about vaccines and immunizations.

## Setup

1. Make sure you have the required packages installed:
   ```bash
   npm install openai
   ```

2. Set up environment variables in your `.env.local` file:
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   ```

3. Get a DeepSeek API key from [DeepSeek's platform](https://deepseek.com) and add it to your `.env.local` file.

## Components

- **page.tsx**: Main UI for the Vaccine AI feature
- **route.ts** (in /api/vaccine-ai/): API endpoint that handles communication with DeepSeek
- **VaccineAIInfoCard**: Component for displaying vaccine information cards

## Usage

The Vaccine AI feature allows users to:

1. Ask questions about vaccines, immunizations, and related health topics
2. Get accurate, evidence-based information
3. Learn about vaccine schedules, side effects, and recommendations

## Implementation Details

- Uses the OpenAI client library to communicate with DeepSeek's API
- Implements streaming responses for a better user experience
- Includes suggested questions to help users get started
- Provides a chat-like interface consistent with the app's design

## Adding More Functionality

To extend this feature:
1. Add more suggested questions in the `SUGGESTED_QUESTIONS` array
2. Enhance the system prompt in the API route to improve responses
3. Add specialized UI components for displaying different types of vaccine information 