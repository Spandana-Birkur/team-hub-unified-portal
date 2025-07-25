from dotenv import load_dotenv

from openai import AzureOpenAI
import os
def AIRequest(user_prompt="The user entered an error, Tell them there was an error in their request."):

    load_dotenv()

    system_prompt = "You are a helpful assistant. You will answer the user's question to the best of your ability. If you do not know the answer, just say what you think will please the user. Be professional."

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
                "content": f"{user_prompt}",
            }
        ],
        max_tokens=4096,
        temperature=1.0,
        top_p=1.0,
        model=deployment
    )

    print(response.choices[0].message.content)

    return response.choices[0].message.content