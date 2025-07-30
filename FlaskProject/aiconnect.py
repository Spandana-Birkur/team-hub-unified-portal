import os
import openai
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv()

# ======================================================================================
# TODO: CONFIGURE YOUR AZURE RESOURCES
# Fill in the following values with your specific resource information.
# You can find these values in the "Keys and Endpoint" sections of your
# Azure AI Search and Azure AI/OpenAI resources in the Azure portal.
# ======================================================================================

# --- Azure AI Search Configuration ---
AZURE_SEARCH_SERVICE_ENDPOINT = os.getenv('AZURE_SEARCH_SERVICE_ENDPOINT')
AZURE_SEARCH_INDEX_NAME = os.getenv('AZURE_SEARCH_INDEX_NAME')  # The index name you created in the wizard
AZURE_SEARCH_ADMIN_KEY = os.getenv('AZURE_SEARCH_ADMIN_KEY') # An admin or query key for your search service

# --- Azure AI/OpenAI Configuration ---
# NOTE: Since we are not using embeddings, you can use either an Azure OpenAI resource
# or a general Azure AI resource endpoint here.
AZURE_AI_ENDPOINT = os.getenv('AZURE_AI_ENDPOINT')
AZURE_AI_API_KEY = os.getenv('AZURE_AI_API_KEY')
AZURE_AI_DEPLOYMENT_NAME = os.getenv('AZURE_AI_DEPLOYMENT_NAME')
AZURE_AI_API_VERSION = os.getenv('AZURE_AI_API_VERSION')

# Check for required environment variables
required_envs = {
    "AZURE_SEARCH_SERVICE_ENDPOINT": AZURE_SEARCH_SERVICE_ENDPOINT,
    "AZURE_SEARCH_INDEX_NAME": AZURE_SEARCH_INDEX_NAME,
    "AZURE_SEARCH_ADMIN_KEY": AZURE_SEARCH_ADMIN_KEY,
    "AZURE_AI_ENDPOINT": AZURE_AI_ENDPOINT,
    "AZURE_AI_API_KEY": AZURE_AI_API_KEY,
    "AZURE_AI_DEPLOYMENT_NAME": AZURE_AI_DEPLOYMENT_NAME,
    "AZURE_AI_API_VERSION": AZURE_AI_API_VERSION,
}

missing = [k for k, v in required_envs.items() if not v]
if missing:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")
else:
    print("All required environment variables loaded successfully.")

# ======================================================================================
#  CORE RAG (RETRIEVAL-AUGMENTED GENERATION) FUNCTION - KEYWORD SEARCH
# ======================================================================================

def get_rag_response_keyword(prompt: str) -> str:
    """
    This function takes a user prompt, performs a KEYWORD search in Azure AI Search,
    and then uses an Azure AI model to generate a response based on the prompt and the
    retrieved information.

    Args:
        prompt (str): The user's question or prompt.

    Returns:
        str: The AI-generated response, grounded in the retrieved data.
    """
    try:
        # --------------------------------------------------------------------------
        # STEP 1: SEARCH - Retrieve relevant data using keyword search
        # --------------------------------------------------------------------------
        print("Step 1: Searching for relevant documents using keyword search...")

        search_client = SearchClient(
            endpoint=AZURE_SEARCH_SERVICE_ENDPOINT,
            index_name=AZURE_SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(AZURE_SEARCH_ADMIN_KEY)
        )

        # Perform a simple keyword search.
        results = search_client.search(
            search_text=prompt,
            top=3  # Retrieve the top 3 most relevant document chunks
        )

        retrieved_content = ""
        for result in results:
            # The field name 'content' is the default used by the wizard.
            # If you configured a different field name, change it here.
            if "content" in result:
                retrieved_content += result["content"] + "\n\n"

        if not retrieved_content:
            print("No relevant content found in the search index for the prompt.")
            return "I couldn't find any information in the documents to answer that question."

        print("Successfully retrieved content from search index.")

        # --------------------------------------------------------------------------
        # STEP 2: AUGMENT - Create a detailed prompt for the AI model
        # --------------------------------------------------------------------------
        print("Step 2: Augmenting the prompt with retrieved content...")

        system_message = f"""
        You are an intelligent assistant. You are designed to answer questions about a specific set of documents.
        Use ONLY the information provided in the 'RETRIEVED DOCUMENTS' section to answer the user's question.
        Do not use any of your outside knowledge unless the user explicitly asks for it. Return the answer in markdown format, utilizing **bold**, italics, code blocks, and titles if required. If the answer is not contained within the provided documents,
        state that you cannot answer the question with the given information.
        Be concise and directly answer the question.

        RETRIEVED DOCUMENTS:
        ---
        {retrieved_content}
        ---
        """

        # --------------------------------------------------------------------------
        # STEP 3: COMPLETE - Send the augmented prompt to the AI model
        # --------------------------------------------------------------------------
        print("Step 3: Sending augmented prompt to the AI model...")

        # Configure the OpenAI client
        # Note: The library is still called 'openai' even for general Azure AI endpoints
        client = openai.AzureOpenAI(
            azure_endpoint=AZURE_AI_ENDPOINT,
            api_key=AZURE_AI_API_KEY,
            api_version=AZURE_AI_API_VERSION,
        )

        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]

        response = client.chat.completions.create(
            model=AZURE_AI_DEPLOYMENT_NAME,
            messages=messages,
            temperature=0.2,
            max_tokens=1000
        )

        print("Successfully received response from the model.")
        return response.choices[0].message.content

    except Exception as e:
        print(f"An error occurred: {e}")
        return "An error occurred while processing your request."

def get_rag_response_with_history(prompt: str, history: List[Dict[str, str]]) -> str:
    """
    This function takes a user prompt and conversation history, searches for relevant
    information, and then uses an AI model to generate a response.

    Args:
        prompt (str): The user's current question or prompt.
        history (List[Dict[str, str]]): A list of previous user/assistant messages.

    Returns:
        str: The AI-generated response.
    """
    try:
        # --------------------------------------------------------------------------
        # STEP 1: SEARCH - Retrieve relevant data from your Azure AI Search index
        # --------------------------------------------------------------------------
        print("Step 1: Searching for relevant documents...")
        search_client = SearchClient(
            endpoint=AZURE_SEARCH_SERVICE_ENDPOINT,
            index_name=AZURE_SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(AZURE_SEARCH_ADMIN_KEY)
        )
        results = search_client.search(search_text=prompt, top=3)

        retrieved_content = ""
        for result in results:
            if "content" in result:
                retrieved_content += result["content"] + "\n\n"

        if not retrieved_content:
            print("No relevant content found in the search index.")
            retrieved_content = "No relevant information was found in the documents."

        print("Successfully retrieved content from search index.")

        # --------------------------------------------------------------------------
        # STEP 2: AUGMENT - Create a detailed prompt for the AI model
        # --------------------------------------------------------------------------
        print("Step 2: Augmenting the prompt...")
        
        # Create history string separately to avoid f-string backslash error
        history_string = ""
        for msg in history:
            history_string += f"{msg['role']}: {msg['content']}\n"

        system_message = f"""
        You are an intelligent assistant. You answer questions about a specific set of documents.
        Use ONLY the information provided in the 'RETRIEVED DOCUMENTS' section to answer the current user question.
        Do not use your outside knowledge unless the user explicitly asks for it. Return the answer in markdown format, utilizing **bold**, italics, code blocks, and titles if required. If the answer isn't in the documents, say so.
        Use the provided 'CONVERSATION HISTORY' to understand the context of the user's current question.

        CONVERSATION HISTORY:
        ---
        {history_string}
        ---

        RETRIEVED DOCUMENTS:
        ---
        {retrieved_content}
        ---
        """

        # --------------------------------------------------------------------------
        # STEP 3: COMPLETE - Send the augmented prompt to the AI model
        # --------------------------------------------------------------------------
        print("Step 3: Sending prompt to the AI model...")
        client = openai.AzureOpenAI(
            azure_endpoint=AZURE_AI_ENDPOINT,
            api_key=AZURE_AI_API_KEY,
            api_version=AZURE_AI_API_VERSION,
        )

        # The message list now includes the system message, the history, and the new user prompt
        messages = [
            {"role": "system", "content": system_message}
        ] + history + [
            {"role": "user", "content": prompt}
        ]

        response = client.chat.completions.create(
            model=AZURE_AI_DEPLOYMENT_NAME,
            messages=messages,
            temperature=0.2,
            max_tokens=1000
        )

        print("Successfully received response from the model.")
        return response.choices[0].message.content

    except Exception as e:
        print(f"An error occurred: {e}")
        return "An error occurred while processing your request."

# ======================================================================================
# EXAMPLE USAGE WITH A CONVERSATION LOOP
# ======================================================================================
if __name__ == '__main__':
    # Before running, make sure you have installed the required libraries:
    # pip install openai azure-search-documents azure-identity

    # And ensure your configuration variables at the top of the file are set correctly.

    # This list will store the conversation history
    conversation_history = []

    print("Chatbot is ready. Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break

        # Get the AI response
        ai_response = get_rag_response_with_history(user_input, conversation_history)
        print(f"AI: {ai_response}")

        # Add the current exchange to the history for the next turn
        conversation_history.append({"role": "user", "content": user_input})
        conversation_history.append({"role": "assistant", "content": ai_response})

