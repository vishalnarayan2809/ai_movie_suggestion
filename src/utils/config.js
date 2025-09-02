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


export async function getAIResponse (formData){
        try {
          const userQuery = Object.values(formData).join(' ');
          const [userEmbedding] = await getEmbedding([userQuery]);
          const { data, error } = await supabase.rpc('match_movies',{
            query_embedding: userEmbedding,
            match_threshold: 0.50,
            match_count: 3
          });
          if (error) {
            console.error('match_documents error:', error);
          } else {
            const formattedData = data.map(obj => obj.content).join(',')
            console.log(formattedData)
            const userInterests = `The users favourite movie and why it is their favorite:${formData.favourite_movie},The user is in the mood to watch something:${formData.genre},The user is feeling and in the mindset to watch something:${formData.mood} `
            const messages =[
              {
                role: "user",
                content: `Content: ${formattedData} UserInterestString: ${userInterests}`
              },{
                role: 'system',
            content: `You are an enthusiastic movies expert who loves recommending movies to people. You will be given two pieces of information - some context about moviess episodes UserInterestString. Your main job is to formulate a short answer to the UserInterestString using the provided context. Make sure to provide the closest answer to the query .If you are unsure and cannot find the answer in the context, say, If the context has anything related to the Query do suggest the user that do not directly say i dont know "Sorry, I don't know the answer." Please do not make up the answer.` 

              }
            ]
           const ai_response = await groq.chat.completions.create({
              model:"openai/gpt-oss-120b",
              messages:messages,
              temperature:0.5,
              frequency_penalty:0.5
            })
            const text = ai_response.choices?.[0]?.message?.content || '';
            console.log(text)
            return text;
          }
        } catch(e){
          console.error('Unexpected:', e);
        }
      }