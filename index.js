// Copyright (c) 2023 AndreaSonny <github@andreasonny83.mailer.me> (https://github.com/andreasonny83)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import '@tensorflow/tfjs-node';
import { Ollama } from 'langchain/llms/ollama';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { RetrievalQAChain } from 'langchain/chains';
import { TensorFlowEmbeddings } from 'langchain/embeddings/tensorflow';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const DEFAULT_WIKI_PAGE = '2023_Hawaii_wildfires';

(async () => {
  const typeIndex = process.argv.indexOf('--type');
  const type = typeIndex > -1 ? process.argv[typeIndex + 1] : undefined;
  const wikiPage = type === 'wiki' && process.argv[typeIndex + 2];
  const query = process.argv.length > 2 && process.argv[process.argv.length - 1];

  try {
    // Retrieve the document from Wikipedia
    const loader = new CheerioWebBaseLoader(
      `https://en.wikipedia.org/wiki/${wikiPage || DEFAULT_WIKI_PAGE}`,
    );
    const data = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });
    const splitDocs = await textSplitter.splitDocuments(data);

    // Then use the TensorFlow Embedding to store these chunks in the datastore
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      new TensorFlowEmbeddings(),
    );
    const retriever = vectorStore.asRetriever();

    const ollama = new Ollama({
      baseUrl: 'http://localhost:11434',
      model: 'llama2',
    });

    const chain = RetrievalQAChain.fromLLM(ollama, retriever);

    const result = await chain.call({
      query: query || 'What is the name of the volcano that erupted in 2021?',
    });

    console.log(result.text);
  } catch (e) {
    console.error(e.message);
  }
})();
