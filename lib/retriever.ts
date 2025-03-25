import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { config } from "dotenv";
config();
const apiKey = process.env.DEEPINFRA_API_KEY;

// document URLs example
const urls = [
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  "https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/",
  "https://lilianweng.github.io/posts/2023-10-25-adv-attack-llm/",
];

const docs = await Promise.all(
  urls.map((url) => new CheerioWebBaseLoader(url).load()),
);
const docsList = docs.flat();

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});
const docSplits = await textSplitter.splitDocuments(docsList);

const embedding = new OpenAIEmbeddings({
  model: "BAAI/bge-large-en-v1.5",
  apiKey: apiKey,
  configuration: {
    baseURL: "https://api.deepinfra.com/v1/openai",
  },
  dimensions: 1024,
});


// Add to vectorDB
const vectorStore = await MemoryVectorStore.fromDocuments(
  docSplits,
  embedding,
);

const retriever = vectorStore.asRetriever();

export { apiKey, retriever };