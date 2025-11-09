import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SHELLKODE_CASE_STUDIES = `
--- RETAIL & E-COMMERCE ---

1.  **Client: Zepto**
    *   **Industry:** Retail / Quick Commerce
    *   **Challenge:** Initial data pipelines were in batch mode, causing data lag. This resulted in challenges calculating delivery ETAs, managing demand-supply cycles, and tracking warehouse packers.
    *   **Solution:** Shellkode built a self-serve data pipeline and a custom in-house ETL framework.
    *   **Outcome:** Achieved a 4x improvement in overall operations, reduced real-time analytics processing time from 8 hours to just 15 minutes, and lowered ETL tool costs by 40%.

2.  **Client: SUGAR Cosmetics**
    *   **Industry:** Retail / Cosmetics
    *   **Challenge:** As the company expanded from online-first to offline markets, it became difficult to track sales performance, manage inventory, and process orders centrally.
    *   **Solution:** Implemented a centralized data platform.
    *   **Outcome:** Resulted in an 80% improvement in decision-making and boosted analytics and reporting capabilities by 3x, giving them a competitive edge.

3.  **Client: Indiamart**
    *   **Industry:** B2B E-commerce
    *   **Challenge:** Needed to resonate with a wider, diverse audience by breaking language barriers.
    *   **Solution:** Deployed a "Translation for Product Description and Content" solution that translates product descriptions into multiple languages.
    *   **Outcome:** Translated over 20 million product data entries, reduced costs by 40% compared to existing solutions, improved customer satisfaction by 30%, and increased platform engagement by 50%.

4. **Client: Leading Grocery Delivery App**
    *   **Industry:** Retail / Grocery Delivery
    *   **Challenge:** Inconsistent and manually created product attributes led to poor product discoverability.
    *   **Solution:** Implemented a GenAI-based "Attribute Generation" solution to automate the creation of accurate, contextually relevant product attributes.
    *   **Outcome:** 80%+ improvement in product discoverability for context-based search. Boosted SEO, automated inventory attribute creation, and increased conversion rates.

5.  **Solution: Agent Assistant for Retail**
    *   **Industry:** Retail / E-commerce
    *   **Challenge:** Traditional chatbots had limited conversational capabilities, no personalization, and lack of multilingual support.
    *   **Solution:** Developed an Agent Assistant with GenAI for real-time query resolution, order tracking, and personalized product recommendations based on browsing history.
    *   **Outcome:** Achieved 90%+ accuracy in responses, reduced average response time from 4.8 to 3.6 min/enquiry, and lowered MTR by up to 30%, boosting customer satisfaction. A key customer saw a 40% improvement in Customer Experience.

--- LOGISTICS ---

1.  **Client: Allcargo**
    *   **Industry:** Logistics
    *   **Challenge:** High manual effort, risk of errors, and slow decision-making due to manual analysis of logistics documents.
    *   **Solution:** Implemented a "Document Extraction & Digitalization (OCR) Agent" using LLMs to automatically analyze shipping instructions and invoices and extract key data.
    *   **Outcome:** Processed over 10 Lks data points, achieving up to 30% faster delivery times by reducing manual effort and enhancing data accuracy.

2.  **Client: XpressBees**
    *   **Industry:** Logistics / E-commerce Delivery
    *   **Challenge:** Needed a faster, more accurate, and scalable customer support solution across multiple channels.
    *   **Solution:** Deployed an "Email Automation" assistant to handle customer queries on WhatsApp, email, Slack, and Freshdesk, providing context-aware responses on shipment status and delivery updates.
    *   **Outcome:** Achieved 90% accuracy and user sentiment understanding, leading to 25% faster response times.

3.  **Client: DTDC**
    *   **Industry:** Logistics
    *   **Challenge:** Needed to improve customer satisfaction and operational efficiency.
    *   **Solution:** Deployed "Diva 2.0", a solution designed to enhance service delivery.
    *   **Outcome:** Significantly improved customer satisfaction and operational efficiency through exceptional expertise and dedication from the Shellkode team.

4.  **Solution: Agentic Assistant for Logistics**
    *   **Industry:** Logistics
    *   **Challenge:** Inefficient customer support and high operational costs from handling routine queries manually.
    *   **Solution:** A Generative AI-powered assistant for seamless customer support that handles order tracking, serviceability checks, price calculation, and compliance inquiries.
    *   **Outcome:** A key client achieved a 30% reduction in customer service queries, leading to increased efficiency and scalability.

--- FINANCIAL SERVICES & FINTECH (FSI) ---

1.  **Client: KreditBee**
    *   **Industry:** Lending Tech
    *   **Challenge:** High response times due to processing ~8000 daily customer emails in multiple languages with a 120-member team.
    *   **Solution:** Implemented an automated system using Langchain, Amazon Bedrock, and LLMs to extract key details from emails and structure the data in JSON for analysis.
    *   **Outcome:** Achieved 95% accuracy, reduced average response time from 4.5 min/mail to 3.6 min/mail, and increased customer satisfaction by 30%.

2.  **Client: Jupiter Money**
    *   **Industry:** Fintech
    *   **Challenge:** Required a comprehensive Disaster Recovery (DR) setup for their entire data platform, including Aurora PostgreSQL, DynamoDB, ElastiCache, MSK, and OpenSearch.
    *   **Solution:** Shellkode implemented a robust, multi-service DR strategy, including DynamoDB Global Tables, MirrorMaker on ECS for MSK, Aurora Global Clusters, and Lambda functions for automated failover and snapshot management.
    *   **Outcome:** A fully functional and automated DR setup ensuring business continuity across all critical data services.

3.  **Client: Mylapay**
    *   **Industry:** Fintech (Recon platform)
    *   **Challenge:** Needed to achieve PCI DSS compliance for their platform and implement baseline security checks.
    *   **Solution:** Deployed Cloud Security Posture Management (CSPM), a SIEM solution, and a compliance dashboard.
    *   **Outcome:** Achieved full PCI-DSS certification in just one month.

4.  **Client: Auxilo**
    *   **Industry:** Financial Services
    *   **Challenge:** Needed to establish a disaster recovery solution to ensure regulatory compliance and business continuity.
    *   **Solution:** Shellkode designed and deployed a DR solution tailored to their needs.
    *   **Outcome:** An invaluable partnership that resulted in a seamless, compliant, and effective disaster recovery solution.

--- SAAS & TECHNOLOGY ---

1.  **Client: Leading Gametech Company**
    *   **Industry:** SaaS
    *   **Challenge:** Difficulty evaluating customer interaction effectiveness, gauging customer emotions, and assessing agent performance over time.
    *   **Solution:** Implemented an "Intelligent Call Analytics" solution. It connects to call recording systems, uses NLP to analyze sentiment and speech, and provides interactive dashboards with KPIs.
    *   **Outcome:** Processed 150k calls/month, reduced average call handling time by 20%, and improved customer engagement by 30% through actionable insights.

--- HEALTHCARE (HCLS) ---

1.  **Client: MedConnect Health**
    *   **Industry:** Healthcare
    *   **Challenge:** Needed a HIPAA-compliant mobile application for patients to schedule appointments and access medical records securely.
    *   **Solution:** Designed and developed native iOS and Android applications using Swift and Kotlin. Implemented robust security measures, including end-to-end encryption and biometric authentication, and integrated with their existing EHR system via FHIR APIs.
    *   **Outcome:** Launched the app in 6 months, achieving a 4.8-star rating on both app stores and improving patient satisfaction scores by 35%.
`;

const systemInstruction = `
You are the Shellkode Sales Buddy, a friendly and expert AI assistant for the Shellkode sales team. Your purpose is to provide quick and accurate information about Shellkode's case studies to help sellers in client conversations.

Your knowledge base consists of the following case studies, organized by industry:
${SHELLKODE_CASE_STUDIES}

Your rules:
1.  ONLY answer questions related to Shellkode, its services, its technologies, and the case studies provided.
2.  When asked a question, synthesize information from the relevant case study to provide a concise, helpful answer. Mention the client's name in your response.
3.  Always be professional, confident, and positive in your tone.
4.  If a seller asks about a technology or industry not covered in the case studies (e.g., 'blockchain'), state that you don't have a specific case study on that topic but you can share what Shellkode has done in related areas based on the provided info.
5.  If asked a question that is completely unrelated to Shellkode or sales (e.g., 'What's the weather like?'), politely decline and steer the conversation back to your purpose. For example: "My purpose is to help you with Shellkode's case studies. How can I assist you with our client work today?"
`;

export const createChatSession = (): Chat => {
  const chat = ai.chats.create({
    model: 'gemini-2.0-pro',
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    }
      
    throw new Error("Image generation failed to produce an image.");
};
