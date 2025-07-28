from flask import Blueprint, request, jsonify
from openai import AzureOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

openai_bp = Blueprint('openai_api', __name__)

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT")

@openai_bp.route('/api/analyze-ticket', methods=['POST'])
def analyze_ticket():
    data = request.get_json()
    prompt = data.get("prompt", "")
    ticket_text = data.get("tickets", "")

    try:
        print("Sending request to Azure OpenAI with:")
        print("Deployment:", DEPLOYMENT_NAME)
        print("Prompt:", prompt)
        print("Ticket:", ticket_text)

        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful IT assistant."},
                {"role": "user", "content": f"{prompt}: {ticket_text}"}
            ]
        )
        return jsonify({"response": response.choices[0].message.content})
    except Exception as e:
        return jsonify({"error": str(e)})

