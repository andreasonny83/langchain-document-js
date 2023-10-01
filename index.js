import '@tensorflow/tfjs-node';
import { Ollama } from 'langchain/llms/ollama';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RetrievalQAChain } from 'langchain/chains';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { TensorFlowEmbeddings } from 'langchain/embeddings/tensorflow';

const WIKI_PAGE = '2023_Hawaii_wildfires';

try {
  // Retrieve the document from Wikipedia
  const loader = new CheerioWebBaseLoader(`https://en.wikipedia.org/wiki/${WIKI_PAGE}`);
  const data = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 20,
  });
  const splitDocs = await textSplitter.splitDocuments(data);

  // Then use the TensorFlow Embedding to store these chunks in the datastore
  const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, new TensorFlowEmbeddings());
  const retriever = vectorStore.asRetriever();

  const ollama = new Ollama({
    baseUrl: 'http://localhost:114342',
    model: 'llama2',
  });

  const chain = RetrievalQAChain.fromLLM(ollama, retriever);

  const result = await chain.call({ query: "When was Hawaii's request for a major disaster declaration approved?" });

  console.log(result.text);
} catch (e) {
  console.error(e.message);
}
