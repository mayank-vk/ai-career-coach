from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
import PyPDF2
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter


text_splitter = CharacterTextSplitter(
            separator='\n',
            chunk_size=2000,
            chunk_overlap=200,
            length_function=len,
        )

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


def perform_qa(query, user_id):
    db = FAISS.load_local(
        f"vector_index/{user_id}",
        embeddings,
        allow_dangerous_deserialization=True,
    )
    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})

    qa_prompt = ChatPromptTemplate.from_template(
        """Answer the question using only the resume context below.
If the answer is not in the context, say you don't know.

Context:
{context}

Question: {question}
"""
    )

    chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | qa_prompt
        | llm
        | StrOutputParser()
    )
    return chain.invoke(query)


app = Flask(__name__)

# File upload configuration
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
    return text


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    api_key=os.getenv("GOOGLE_API_KEY"),
)


resume_summary_template = """
Role: You are an AI Career Coach.

Task: Given the candidate's resume, provide a comprehensive summary that includes the following key aspects:

- Career Objective
- Skills and Expertise
- Professional Experience
- Educational Background
- Notable Achievements

Instructions:
Provide a concise summary of the resume, focusing on the candidate's skills, experience, and career trajectory. Ensure the summary is well-structured, clear, and highlights the candidate's strengths in alignment with industry standards.

Requirements:
{resume}

"""


resume_prompt = PromptTemplate(
    input_variables=["resume"],
    template=resume_summary_template,
)

# Modern LangChain style: prompt | llm | parser  (replaces old LLMChain)
resume_analysis_chain = resume_prompt | llm | StrOutputParser()


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error":"no file part"}),400
    user_id=request.form['user_id']
    file = request.files['file']
    vector_folder=f"vector_index/{user_id}"
    
    if file.filename == '':
        return jsonify({"error":"no file selected"}),400
    
    if file:
        # Save the uploaded file
        filename = secure_filename(file.filename)
        user_upload_folder=os.path.join(app.config['UPLOAD_FOLDER'],user_id)
        if not os.path.exists(user_upload_folder):
            os.makedirs(user_upload_folder)
        file_path = os.path.join(user_upload_folder, filename)
        file.save(file_path)
        
        # Extracted   the  text from the PDF
        resume_text = extract_text_from_pdf(file_path)
        splitted_text = text_splitter.split_text(resume_text)
        vectorstore = FAISS.from_texts(splitted_text, embeddings)
        if not os.path.exists(vector_folder):
            os.makedirs(vector_folder)
        vectorstore.save_local(vector_folder)
        
        resume_analysis = resume_analysis_chain.invoke({"resume": resume_text})
        
        return jsonify({'resume_analysis': resume_analysis,'resume_text':resume_text})

@app.route('/ask', methods=['POST'])
def ask_query():
    user_id=request.form['user_id']
    if not os.path.exists(f"vector_index/{user_id}"):
        return jsonify({"error":"resume not uploaded"}),400
    query = request.form['query']
    result = perform_qa(query,user_id)
    return jsonify({"query":query,"result":result})


if __name__ == "__main__":
    app.run(debug=True)
