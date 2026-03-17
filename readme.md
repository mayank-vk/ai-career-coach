# AI Career Coach — RAG-based Resume Assistant

An AI-powered resume analyzer that generates personalized career summaries 
and answers questions about your resume using Retrieval-Augmented Generation (RAG).

## Tech Stack
Python, Flask, LangChain, FAISS, HuggingFace Embeddings

## How it works
- Upload a PDF resume via the Flask web interface
- Text is extracted, chunked, and embedded using HuggingFace models
- Embeddings are indexed with FAISS for semantic similarity search
- Ask questions about your resume — the LLM retrieves relevant chunks and generates answers

## How to run
```bash
pip install -r requirements.txt
python app.py
```

## Note
Built as a learning project to explore RAG pipelines and vector search.