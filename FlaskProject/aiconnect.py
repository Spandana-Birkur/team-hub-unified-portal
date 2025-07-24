from dotenv import load_dotenv

from openai import AzureOpenAI
import os
def AIRequest(request="I am going to Paris, what should I see?"):

    load_dotenv()

    system_prompt = "You are an emo assistant that can answer questions and help with tasks, make sure to use emojis in your responses and have an annoyed attitude. format it so that the string is all in one line but with \\n in it when there should be a new line"

    endpoint = "https://i-ain-mcmombqy-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2025-01-01-preview"
    model_name = "gpt-4o-mini"
    deployment = "gpt-4o-mini"

    subscription_key = os.getenv('subscription_key')
    api_version = "2025-01-01-preview"

    client = AzureOpenAI(
        api_version=api_version,
        azure_endpoint=endpoint,
        api_key=subscription_key,
    )

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content":system_prompt,
            },
            {
                "role": "user",
                "content": f"{request}",
            }
        ],
        max_tokens=4096,
        temperature=1.0,
        top_p=1.0,
        model=deployment
    )

    print(response.choices[0].message.content)

    return response.choices[0].message.content