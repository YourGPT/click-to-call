# Click to Call Demo

Add a **"Call Us"** button to any website and turn visitors into qualified leads with AI-powered outbound calling. This repository showcases several examples using [YourGPT](https://yourgpt.ai/) Phone Agents in a [Next.js](https://nextjs.org/) app.

## Features
- **Multiple scenarios** – Try different use cases in the `case/` directory:
  - Booking a doctor appointment
  - Planning a trip
  - Managing a customer in your CRM
  - Requesting parcel delivery
  - Asking about website development services
- **Instant outbound calls** – The examples integrates directly with the YourGPT API to start a outbound call when the form is submitted.


## Prerequisites
1. [Create an account on YourGPT](https://yourgpt.ai/) and build a chatbot.
2. Configure a Voice AI agent and note its **Agent ID**.
3. Generate an API key from the [API integration page](https://docs.yourgpt.ai/chatbot/integrations/api-integration/).

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an `.env.local` file with the API key and Agent ID from the setup steps (required for the doctor appointment demo):

```bash
NEXT_PUBLIC_API_KEY=your_api_key_here
NEXT_PUBLIC_AGENT_ID=your_agent_id_here
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and choose a scenario.

## Adding a New Case

Edit [`src/app/data/cases.ts`](src/app/data/cases.ts) to define a new `slug`, title, and description. Then create a page under `src/app/case/<your-slug>` that renders your call button or form.

## Building for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript

Feel free to customize these examples to fit your own project. Pull requests and issues are welcome!
