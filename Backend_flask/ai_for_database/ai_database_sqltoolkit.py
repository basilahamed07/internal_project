import os
import urllib.parse
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_google_genai import GoogleGenerativeAIEmbeddings
# from langchain_openai import AzureChatOpenAI

# from models import db,Project_name,Testers,Tester_name
# from flask_jwt_extended import jwt_required,get_jwt_identity
# from datetime import date
# from sqlalchemy import create_engine, distinct

from langchain.prompts import ChatPromptTemplate

from langchain_core.prompts import (
    ChatPromptTemplate,
    FewShotPromptTemplate,
    MessagesPlaceholder,
    PromptTemplate,
    SystemMessagePromptTemplate,
)



from langchain_core.example_selectors import SemanticSimilarityExampleSelector
from langchain_community.vectorstores import FAISS
# from langchain_openai import OpenAIEmbeddings
from langsmith import traceable
from urllib.parse import quote_plus
from dotenv import load_dotenv
# from langchain_core.tools impor/t tool
from langchain.agents import Tool
from sqlalchemy import create_engine
from langchain_huggingface import HuggingFaceEmbeddings




# Initialize Flask App

# Load environment variables
load_dotenv()


required_env_vars = ["LANGCHAIN_API_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Set up OpenAI API key
# os.environ["OPENAI_API_TYPE"] = os.getenv("AZURE_OPENAI_API_TYPE")
# os.environ["AZURE_OPENAI_ENDPOINT"] = os.getenv("AZURE_OPENAI_ENDPOINT")
# os.environ["OPENAI_API_KEY"] = os.getenv("AZURE_OPENAI_API_KEY")
# os.environ["OPENAI_API_VERSION"] = os.getenv("AZURE_OPENAI_API_VERSION")

os.environ['LANGCHAIN_TRACING_V2']='true'
os.environ['LANGCHAIN_ENDPOINT'] ="https://api.smith.langchain.com"
os.environ['LANGCHAIN_API_KEY'] =os.getenv("LANGCHAIN_API_KEY")
os.environ['LANGCHAIN_PROJECT']="internal_project"
groq_api = os.getenv("groq_api_key")


# Database configuration
# DB_CONFIG = {
#     "host": os.getenv("DB_HOST", "localhost"),
#     "port": os.getenv("DB_PORT", "5432"),  # Default PostgreSQL port
#     "username": os.getenv("DB_USERNAME", "postgres"),
#     "password": os.getenv("DB_PASSWORD", 'Database@123'),
#     "database": os.getenv("DB_NAME", "AES_Mini"),
# }

# # Ensure password and other sensitive info are encoded
# encoded_password = urllib.parse.quote(DB_CONFIG["password"])

# Connection string
# DATABASE_URL = (
#     f"postgresql+psycopg2://{DB_CONFIG['username']}:{encoded_password}"
#     f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
# )


#for here i will create the database connection  by using the create_engine 

# server = os.getenv("SQL_SERVER_HOST")
# database = os.getenv("SQL_SERVER_DB")
# username = os.getenv("SQL_SERVER_USER")
# password = os.getenv("SQL_SERVER_PASSWORD")
# for database url


url = os.getenv("DATABASE_URL")
embadding_api = os.environ["GOOGLE_API_KEY"]



import getpass
import os

if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = getpass("Provide your Google API key here")

# DATABASE_URL = (
#     f"mssql+pyodbc://{username}:{password}@{server}/{database}"
#     f"?driver=ODBC Driver 17 for SQL Server"
# )


DATABASE_URL = (f"{url}")
# Check database connection
try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"Failed to connect to the database: {e}")
# Create an instance of SQLDatabase
# db = SQLDatabase.from_uri(DATABASE_URL)
db = SQLDatabase.from_uri(DATABASE_URL)
# Initialize LangChain LLM
llm = ChatGroq(temperature=0, groq_api_key=groq_api, model_name="llama-3.3-70b-versatile")
# Decide table and column function
def decide_table_column(query):
    """Decide which table and column will answer the query of the user."""
    with open(r"E:\Changepond\Internal_project\Backend_flask\ai_for_database\table_column_description.txt", 'r') as file:
        file_content = file.read()
    template = f"""
    Based on the given user query: "{query}", return the table names and column names which will fetch the data from the database.
    If multiple tables are required to respond to the user query, select appropriate columns from different tables to form appropriate JOINs.
    Table and column descriptions are given here:
    {file_content}
    """
    prompt_template = ChatPromptTemplate.from_template(template)
    prompt = prompt_template.invoke({"query": query, "file_content": file_content})
    result = llm.invoke(prompt)
    return result.content
# Create a custom tool for deciding table and column
custom_tool = Tool(
    name="decide_table_column",
    func=decide_table_column,
    description="Decides which tables and columns answer the user's query, and determines joins between tables if required.",
)
# Prompt structure for SQL generation
system_prefix = """You are an AI agent designed to interact with a SQL database to answer questions by querying specific tables and columns based on the provided schema information.
Given an input question, construct a syntactically correct SQL query based on the table and column descriptions. Retrieve the necessary information from the tables to provide an accurate answer. Ensure that the query is contextually relevant to the input question and adheres to the following guidelines:
1. Query Structure:
   - Avoid selecting all columns; only include relevant columns based on the question.
   - Limit results to the necessary records to maintain efficient queries.
   - Ensure that your queries do not contain DML statements (such as `INSERT`, `UPDATE`, `DELETE`, or `DROP`).

2. Error Handling:
   - Double-check the query syntax before execution.
   - If an error occurs during execution, rewrite the query based on error feedback and try again.
3. Question Types:
   - Any question related to 'Index Performance Summary' comes in, in response data of MTD, QTD and YTD is expected.
   - MTD stands for “month to date.” It’s the period starting from the beginning of the current month up until now … but not including today’s date, because it might not be complete yet.
   - QTD stands for “quarter to date.” It’s used in exactly the same way as MTD, except you’re looking at the time period from the start of this quarter until now.
   - YTD stands for “year to date” — again, from the beginning of the current year, up to but not including today.
   - For percentage data, please provide valuation in percentage example: 25.5%
Here are some example user inputs and their corresponding SQL queries:
"""
system_suffix = """
When providing the final answer:
1. Contextualize: Summarize the information retrieved in a way that directly addresses the user's question. Provide concise, relevant answers instead of just returning raw query results.
2. Clarify Ambiguity: If the retrieved information does not directly answer the question, explain the context or suggest potential follow-up queries to refine the result.
3. Error Responses: If a query cannot be executed due to a syntax or data issue, respond with a clear message, like "The requested information could not be retrieved due to a query error. Please refine your question."
4. Unknown Queries: If the question is outside the scope of the database tables or cannot be answered with available data, respond with "I don't know."
Answer concisely and clearly, ensuring accuracy and relevance to the user's question.
"""
examples = [
    {"input": "Show me the valuation types available.", "query": "SELECT ValuationType FROM ValuationTypeTable;"},
    {"input": "show top 3 index performance summary with Month to Date(MTD) as on 31-oct-2024?", "query": "DECLARE @qtdDate DATETIME = '2024-10-01'; SELECT TOP 5 mi.FundName, mi.MarketIndexId, EXP(SUM(CASE WHEN v.ValuationDate = EOMONTH(v.ValuationDate) THEN LOG(NULLIF(1 + v.Value / 100, 0)) END)) - 1 AS QTD_Performance FROM Valuations v JOIN MarketIndex mi ON v.EntityId = mi.MarketIndexId WHERE v.EntityTypeId = 3 AND v.ValuationDate >= @qtdDate AND v.FrequencyId = 3 GROUP BY mi.FundName, mi.MarketIndexId ORDER BY QTD_Performance DESC;"},
    {"input": "get the index performance summary as on 01-10-2024.", 
     "query": """DECLARE @qtdDate DATETIME = '2024-10-01'; SELECT TOP 5 mi.MarketIndexName, v.EntityId AS MarketIndexId,
            EXP(SUM(CASE WHEN v.ValuationDate = EOMONTH(v.ValuationDate) THEN LOG(NULLIF(1 + v.Value / 100, 0)) END)) - 1 AS QTD_Performance 
            FROM AES_Mini.dbo.Valuations v JOIN AES_Mini.dbo.MarketIndex mi ON v.EntityId = mi.MarketIndexId WHERE v.EntityTypeId = 3 AND v.ValuationDate >= @qtdDate AND v.FrequencyId = 3 
            GROUP BY mi.MarketIndexName, v.EntityId 
            ORDER BY QTD_Performance DESC;"""},
    {"input": "give me top 5 index performance summary",
    "query": """SELECT TOP 5 mi.MarketIndexName, v.EntityId AS MarketIndexId,
            EXP(SUM(CASE WHEN v.ValuationDate = EOMONTH(v.ValuationDate) THEN LOG(NULLIF(1 + v.Value / 100, 0)) END)) - 1 AS QTD_Performance 
            FROM AES_Mini.dbo.Valuations v JOIN AES_Mini.dbo.MarketIndex mi ON v.EntityId = mi.MarketIndexId WHERE v.EntityTypeId = 3 AND v.ValuationDate >= @qtdDate AND v.FrequencyId = 3 
            GROUP BY mi.MarketIndexName, v.EntityId 
            ORDER BY QTD_Performance DESC;"""},
]
embeddings  = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=embadding_api)
# embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L12-v2")
# Select examples using semantic similarity
example_selector = SemanticSimilarityExampleSelector.from_examples(
    examples,
    embeddings,
    FAISS,
    k=5,
    input_keys=["input"],
)
prompt = FewShotPromptTemplate(
    example_selector=example_selector,
    example_prompt=PromptTemplate.from_template("User input: {input}\nSQL query: {query}"),
    input_variables=["input", "dialect", "top_k"],
    prefix=system_prefix,
    suffix=system_suffix,
)
full_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate(prompt=prompt),
        ("human", "{input}"),
        MessagesPlaceholder("agent_scratchpad"),
    ]
)
# Create SQL Agent
toolkit = SQLDatabaseToolkit(db=db, llm=llm)  # Use the SQLDatabase instance here
agent_executor = create_sql_agent(llm=llm, toolkit=toolkit, extra_tools=[custom_tool], prompt=full_prompt, verbose=True, agent_type="openai-tools", handle_parsing_errors=True)
    


def ai_chatbot_routing(app):

    # @traceable
    # # Define Flask API route
    # @app.route('/query', methods=['GET'])
    # def query_database():
    #     query = request.args.get('query')

    #     if not query:
    #         return jsonify({"error": "No query provided"}), 400

    #     try:
    #         result = agent_executor.invoke(query)
    #         return jsonify({"result": result})
    #     except Exception as e:
    #         return jsonify({"error": str(e)}), 500

    @traceable
    @app.route('/somting_quary', methods=['POST'])
    def query_database():
        try:
            # Parse JSON input from the request
            data = request.get_json()

            if not data or 'question' not in data:
                return jsonify({"error": "No query provided. Please include a 'query' field in the JSON body."}), 400

            query = data['question']


            # Invoke the agent to get the SQL query results
            result = agent_executor.invoke(query)

            # Assuming the result is already in a structured JSON format, return it directly
            return jsonify({"result": result})

        except Exception as e:
            # Catch any errors and return as JSON
            return jsonify({"error": str(e)}), 500

