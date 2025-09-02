import { createClient } from "@supabase/supabase-js";
import data from "./content.js"
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import Groq from 'groq-sdk'


// Supabase Set Up
const privateKey = import.meta.env.VITE_SUPABASE_API_KEY;
const Nomic_api = import.meta.env.VITE_NOMIC_API_KEY
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = import.meta.env.VITE_SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);




// Using LangChain text splitting and using NOMIC embedding model and storing it in Supabase Vector DB
   export async function  Setup() {
   const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap:50,
   }) 
      const docs = data.map(movie => JSON.stringify(movie));
   const chunk =  await splitter.createDocuments(docs)
  const chunkString = chunk.map(obj => obj.pageContent)
      const Embeddata = await getEmbedding(chunkString)
      const rows = Embeddata.map((obj,index) =>({
        content: chunkString[index],
        embedding: obj
      }))
      console.log(rows)
     const{error} = await supabase.from('movies').insert(rows);
      if (error) {
    console.error("Supabase insert error:", error);
  } else {
    console.log("Embedding and storing complete!");
  }
}

//NOMIC EMBEDDING PROCESS
export  async function getEmbedding(text) {
    const res = await fetch('https://api-atlas.nomic.ai/v1/embedding/text',{
      method: "POST",
      headers:{
        "Authorization": `Bearer ${Nomic_api}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        model: "nomic-embed-text-v1.5",
        texts: text
      })
    })
     if(!res.ok){
    throw new Error(`Request failed ${res.status}`, await res.text())
  }  
  const data = await res.json()
  return data.embeddings
  }


//  GROQ API SET UP

 const groq = new Groq({
    dangerouslyAllowBrowser: true,
    apiKey: import.meta.env.VITE_GROQ_API_KEY
  })


// ...existing code...
export async function getAIResponse (userQuery){
  try {
    const [userEmbedding] = await getEmbedding([userQuery]);
    const { data, error } = await supabase.rpc('match_movies',{
      query_embedding: userEmbedding,
      match_threshold: 0.50,
      match_count: 3
    });
    if (error) {
      console.error('match_documents error:', error);
    } else {
      const formattedData = data.map(obj => obj.content).join(',');
      const userInterests = `${userQuery}`;
      const messages = [
        {
          role: 'system',
          content: `You are an enthusiastic movies expert.
Return ONLY a valid JSON array of exactly 3 objects.
Each object MUST have:
  "movie_name": string
  "choice_reason": string
No extra commentary, no backticks.
Example:
[{"movie_name":"Inception","choice_reason":"High-concept thriller that fits X"},
 {"movie_name":"Amelie","choice_reason":"Whimsical tone for Y"},
 {"movie_name":"Spirited Away","choice_reason":"Blend of wonder and depth"}]`
        },
        {
          role: "user",
          content: `Context: ${formattedData}\nUserInterestString: ${userInterests}`
        }
      ];
      const ai_response = await groq.chat.completions.create({
        model:"openai/gpt-oss-120b",
        messages,
        temperature:0.4,
        frequency_penalty:0.3
      });
      const text = (ai_response.choices?.[0]?.message?.content || '').trim();
      return text;
    }
  } catch(e){
    console.error('Unexpected:', e);
  }
}
// ...existing code...