import { StateGraph } from "@langchain/langgraph";
import { GraphState, toolNode } from "./agent";
import { gradeDocuments, agent, rewrite, generate } from "./edges";

// Define the graph
const workflow = new StateGraph(GraphState)
  // Define the nodes which we'll cycle between.
  .addNode("agent", agent)
  .addNode("retrieve", toolNode)
  .addNode("gradeDocuments", gradeDocuments)
  .addNode("rewrite", rewrite)
  .addNode("generate", generate);