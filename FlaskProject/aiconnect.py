from datetime import datetime
import os
import openai
from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import VectorizedQuery
from dotenv import load_dotenv
from typing import List, Dict

load_dotenv(override=False)

# ======================================================================================
# TODO: CONFIGURE YOUR AZURE RESOURCES
# Fill in the following values with your specific resource information.
# ======================================================================================

# --- Azure AI Search Configuration ---
AZURE_SEARCH_SERVICE_ENDPOINT = os.getenv('AZURE_SEARCH_SERVICE_ENDPOINT')
AZURE_SEARCH_INDEX_NAME = os.getenv('AZURE_SEARCH_INDEX_NAME')
AZURE_SEARCH_ADMIN_KEY = os.getenv('AZURE_SEARCH_ADMIN_KEY')
# The name of the vector field in your search index.
AZURE_SEARCH_VECTOR_FIELD_NAME = os.getenv('AZURE_SEARCH_VECTOR_FIELD_NAME')

# --- Azure AI/OpenAI Configuration ---
AZURE_AI_ENDPOINT = os.getenv('AZURE_AI_ENDPOINT')
AZURE_AI_API_KEY = os.getenv('AZURE_AI_API_KEY')
AZURE_AI_API_VERSION = os.getenv('AZURE_AI_API_VERSION')

# --- LLM and Embedding Model Names ---
# The deployment name for your CHAT model (e.g., gpt-4, gpt-35-turbo)
AZURE_AI_DEPLOYMENT_NAME = os.getenv('AZURE_AI_DEPLOYMENT_NAME') 
# The deployment name for your EMBEDDING model (e.g., text-embedding-ada-002)
AZURE_AI_EMBEDDING_DEPLOYMENT_NAME = os.getenv('AZURE_AI_EMBEDDING_DEPLOYMENT_NAME')
# Semantic configuration name (if applicable)
SEMANTIC_CONFIGURATION_NAME = os.getenv('SEMANTIC_CONFIGURATION_NAME')


# Check for required environment variables
required_envs = {
    "AZURE_SEARCH_SERVICE_ENDPOINT": AZURE_SEARCH_SERVICE_ENDPOINT,
    "AZURE_SEARCH_INDEX_NAME": AZURE_SEARCH_INDEX_NAME,
    "AZURE_SEARCH_ADMIN_KEY": AZURE_SEARCH_ADMIN_KEY,
    "AZURE_AI_ENDPOINT": AZURE_AI_ENDPOINT,
    "AZURE_AI_API_KEY": AZURE_AI_API_KEY,
    "AZURE_AI_DEPLOYMENT_NAME": AZURE_AI_DEPLOYMENT_NAME,
    "AZURE_AI_API_VERSION": AZURE_AI_API_VERSION,
    "AZURE_AI_EMBEDDING_DEPLOYMENT_NAME": AZURE_AI_EMBEDDING_DEPLOYMENT_NAME,
    "AZURE_SEARCH_VECTOR_FIELD_NAME": AZURE_SEARCH_VECTOR_FIELD_NAME,
}

missing = [k for k, v in required_envs.items() if not v]
if missing:
    raise EnvironmentError(f"Missing required environment variables: {', '.join(missing)}")
else:
    print("All required environment variables loaded successfully.")


# ======================================================================================
#  NEW RAG FUNCTION - HYBRID (VECTOR + KEYWORD) SEARCH
# ======================================================================================

def get_rag_response_hybrid(prompt: str) -> str:
    """
    This function takes a user prompt, generates an embedding for it, performs
    a HYBRID (vector + keyword) search in Azure AI Search, and then uses an Azure AI
    model to generate a response based on the prompt and the retrieved information.

    Args:
        prompt (str): The user's question or prompt.

    Returns:
        str: The AI-generated response, grounded in the retrieved data.
    """
    try:
        # Configure the Azure OpenAI client for both embeddings and chat
        client = openai.AzureOpenAI(
            azure_endpoint=AZURE_AI_ENDPOINT,
            api_key=AZURE_AI_API_KEY,
            api_version=AZURE_AI_API_VERSION,
        )

        # --------------------------------------------------------------------------
        # STEP 1: EMBED - Generate an embedding for the user's prompt
        # --------------------------------------------------------------------------
        print("Step 1: Generating embedding for the prompt using the embedding model...")
        
        embedding_response = client.embeddings.create(
            model=AZURE_AI_EMBEDDING_DEPLOYMENT_NAME,
            input=prompt
        )
        prompt_embedding = embedding_response.data[0].embedding
        print("Successfully generated prompt embedding.")

        # --------------------------------------------------------------------------
        # STEP 2: SEARCH - Retrieve relevant data using hybrid search
        # --------------------------------------------------------------------------
        print("Step 2: Searching for relevant documents using hybrid (vector + keyword) search...")

        search_client = SearchClient(
            endpoint=AZURE_SEARCH_SERVICE_ENDPOINT,
            index_name=AZURE_SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(AZURE_SEARCH_ADMIN_KEY)
        )

        # Construct the vector query
        # The 'fields' parameter must match the name of the vector field in your search index.
        # The default name created by the Azure AI Studio wizard is "AZURE_SEARCH_VECTOR_FIELD_NAME".
        vector_query = VectorizedQuery(
            vector=prompt_embedding, 
            k_nearest_neighbors=3, 
            fields=AZURE_SEARCH_VECTOR_FIELD_NAME
        )

        # Perform hybrid search
        results = search_client.search(
            search_text=prompt,
            vector_queries=[vector_query],
            select=["content", "title"],  # Make sure title is selected

            # --- ADD THESE THREE LINES ---
            query_type="semantic",
            semantic_configuration_name=SEMANTIC_CONFIGURATION_NAME,
            query_caption="extractive",
            # ---------------------------

            top=3
        )

        retrieved_content = ""
        print("\n--- RETRIEVED FOR CONTEXT ---")
        for result in results:
            print(f"Score: {result['@search.score']}")
            print(f"Content: {result['content'][:250]}...") # Print first 250 chars
            print("--------------------")
            if "content" in result:
                retrieved_content += result["content"] + "\n\n"

        if not retrieved_content:
            print("No relevant content was retrieved from the search index.")

        print("Successfully retrieved content from search index.")

        # --------------------------------------------------------------------------
        # STEP 3: AUGMENT - Create a detailed prompt for the AI model
        # --------------------------------------------------------------------------
        print("Step 3: Augmenting the prompt with retrieved content...")

        formatted_datetime = datetime.now().strftime("Year:%Y-Month:%m-Day:%d %H:%M:%S")

        system_message = f"""
        You are an intelligent assistant. You are designed to answer questions about a specific set of documents.
        Use ONLY the information provided in the 'RETRIEVED DOCUMENTS' section and the 'CURRENT DATE' section to answer the user's question.
        Do not use any of your outside knowledge. Return the answer in markdown format, utilizing **bold**, italics, code blocks, and titles if required. If the answer is not contained within the provided documents,
        state that you cannot answer the question with the given information.
        Be concise and directly answer the question.

        RETRIEVED DOCUMENTS:
        ---
        {retrieved_content}
        ---

        CURRENT DATE:
        ---
        {formatted_datetime}
        ---
        """

        # --------------------------------------------------------------------------
        # STEP 4: COMPLETE - Send the augmented prompt to the AI model
        # --------------------------------------------------------------------------
        print("Step 4: Sending augmented prompt to the chat model...")
        
        # Note: We already configured the client at the top of the function
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
    
def get_rag_response_hybrid_with_history(prompt: str, history: List[Dict[str, str]]) -> str:
    """
    This function takes a user prompt and conversation history, generates an
    embedding for the prompt, performs a HYBRID search, and then uses an AI
    model to generate a response, considering the conversation context.

    Args:
        prompt (str): The user's current question or prompt.
        history (List[Dict[str, str]]): A list of previous user/assistant messages.

    Returns:
        str: The AI-generated response.
    """
    try:
        # Configure the Azure OpenAI client for both embeddings and chat
        client = openai.AzureOpenAI(
            azure_endpoint=AZURE_AI_ENDPOINT,
            api_key=AZURE_AI_API_KEY,
            api_version=AZURE_AI_API_VERSION,
        )

        # --------------------------------------------------------------------------
        # STEP 1: EMBED - Generate an embedding for the user's prompt
        # --------------------------------------------------------------------------
        print("Step 1: Generating embedding for the prompt...")
        
        embedding_response = client.embeddings.create(
            model=AZURE_AI_EMBEDDING_DEPLOYMENT_NAME,
            input=prompt
        )
        prompt_embedding = embedding_response.data[0].embedding
        print("Successfully generated prompt embedding.")

        # --------------------------------------------------------------------------
        # STEP 2: SEARCH - Retrieve relevant data using hybrid search
        # --------------------------------------------------------------------------
        print("Step 2: Searching for relevant documents using hybrid search...")

        search_client = SearchClient(
            endpoint=AZURE_SEARCH_SERVICE_ENDPOINT,
            index_name=AZURE_SEARCH_INDEX_NAME,
            credential=AzureKeyCredential(AZURE_SEARCH_ADMIN_KEY)
        )

        # The 'fields' parameter must match the name of the vector field in your search index.
        # The default name created by the Azure AI Studio wizard is "AZURE_SEARCH_VECTOR_FIELD_NAME".
        vector_query = VectorizedQuery(
            vector=prompt_embedding, 
            k_nearest_neighbors=3, 
            fields=AZURE_SEARCH_VECTOR_FIELD_NAME
        )

        results = search_client.search(
            search_text=prompt,
            vector_queries=[vector_query],
            select=["content", "title"],  # Make sure title is selected

            # --- ADD THESE THREE LINES ---
            query_type="semantic",
            semantic_configuration_name=SEMANTIC_CONFIGURATION_NAME,
            query_caption="extractive",
            # ---------------------------

            top=3
        )

        retrieved_content = ""
        for result in results:
            if "content" in result:
                retrieved_content += result["content"] + "\n\n"

        if not retrieved_content:
            print("No relevant content found in the search index.")
            retrieved_content = "No relevant information was found in the documents for this query."

        print("Successfully retrieved content from search index.")

        # --------------------------------------------------------------------------
        # STEP 3: AUGMENT - Create a detailed prompt for the AI model
        # --------------------------------------------------------------------------
        print("Step 3: Augmenting the prompt with history and retrieved content...")
        
        # Create history string separately to avoid f-string backslash error
        history_string = ""
        for msg in history:
            history_string += f"{msg['role']}: {msg['content']}\n"


        formatted_datetime = datetime.now().strftime("Year:%Y-Month:%m-Day:%d %H:%M:%S")

        system_message = f"""
        You are an intelligent assistant. You answer questions about a specific set of documents.
        Use ONLY the information provided in the 'RETRIEVED DOCUMENTS' section and the 'CURRENT DATE' section to answer the user's question.
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

        CURRENT DATE:
        ---
        {formatted_datetime}
        ---
        """

        # --------------------------------------------------------------------------
        # STEP 4: COMPLETE - Send the augmented prompt to the AI model
        # --------------------------------------------------------------------------
        print("Step 4: Sending final prompt to the chat model...")
        
        # The message list now includes the system message, the history, and the new user prompt
        # The system message now contains the context from both history and retrieved docs
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
# EXAMPLE USAGE - You can adapt this to use the new function
# ======================================================================================
if __name__ == '__main__':
    # Before running, make sure you have installed the required libraries:
    # pip install openai azure-search-documents azure-identity python-dotenv

    # And ensure your configuration variables at the top of the file are set correctly.

    # This list will store the conversation history
    conversation_history = []

    print("Chatbot with Hybrid Search and History is ready. Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break

        # Get the AI response using the new hybrid function with history
        ai_response = get_rag_response_hybrid_with_history(user_input, conversation_history)
        print(f"AI: {ai_response}")

        # Add the current exchange to the history for the next turn
        conversation_history.append({"role": "user", "content": user_input})
        conversation_history.append({"role": "assistant", "content": ai_response})
