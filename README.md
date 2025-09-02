# PopChoice - AI-Powered Movie Recommendation System

PopChoice is an intelligent movie recommendation application that leverages cutting-edge AI technologies to provide personalized movie suggestions based on user preferences. The app combines vector embeddings, semantic search, and large language models to deliver highly relevant recommendations.

## 🌟 Features

- **Personalized Recommendations**: Get movie suggestions tailored to your favorite films and current mood
- **AI-Powered Analysis**: Uses Groq's advanced language models for intelligent content analysis
- **Vector Similarity Search**: Employs vector embeddings for semantic movie matching
- **Real-time Processing**: Instant recommendations based on user input
- **Modern UI**: Clean, responsive interface with intuitive user experience

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **CSS** - Custom styling with Google Fonts integration

### AI & Machine Learning
- **Groq API** - High-performance AI inference platform
- **Nomic AI** - Advanced embedding models for text representation
- **LangChain** - Framework for building AI applications

### Database & Storage
- **Supabase** - PostgreSQL with vector extensions for similarity search
- **Supabase Vector DB** - Native vector storage and querying capabilities

## 🏗️ Architecture

### Data Flow
1. **User Input Collection**: Gather preferences (favorite movie, genre preferences, mood)
2. **Query Embedding**: Convert user input to vector embeddings using Nomic AI
3. **Vector Search**: Query Supabase vector database for semantically similar movies
4. **AI Analysis**: Use Groq to analyze retrieved movies and generate recommendations
5. **Result Presentation**: Display personalized recommendations to user

### Core Components

#### AI Implementation
- **Groq Integration**: Uses `groq-sdk` for chat completions
- **Model**: `openai/gpt-oss-120b` for high-quality text generation
- **Prompt Engineering**: Structured prompts combining user interests with retrieved movie data
- **Temperature Control**: Balanced creativity (0.5) and consistency (frequency_penalty: 0.5)

#### Vector Database Implementation
- **Supabase RPC Function**: Custom `match_movies` function for vector similarity search
- **Similarity Threshold**: 0.50 match threshold for relevant results
- **Result Limit**: Returns top 3 most similar movies
- **Real-time Querying**: Efficient vector operations for fast recommendations

#### Embeddings
- **Nomic AI Model**: `nomic-embed-text-v1.5` for high-quality text embeddings
- **Text Chunking**: LangChain's `RecursiveCharacterTextSplitter` with:
  - Chunk size: 512 characters
  - Overlap: 50 characters
- **Batch Processing**: Efficient embedding generation for multiple text chunks

#### Data Processing Pipeline
```javascript
// Text splitting and embedding generation
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 50,
});

const docs = data.map(movie => JSON.stringify(movie));
const chunks = await splitter.createDocuments(docs);
const embeddings = await getEmbedding(chunks.map(obj => obj.pageContent));

// Vector storage in Supabase
const rows = embeddings.map((embedding, index) => ({
  content: chunks[index].pageContent,
  embedding: embedding
}));
```

## 📊 Movie Database

The system includes a curated database of popular movies with rich metadata:

- **Avatar: The Way of Water** (2022) - Sci-fi action adventure
- **The Fabelmans** (2022) - Coming-of-age drama
- **Everything Everywhere All at Once** (2022) - Multiverse comedy
- **Oppenheimer** (2023) - Biographical thriller
- **Barbie** (2023) - Fantasy comedy
- **Spider-Man: Across the Spider-Verse** (2023) - Animated superhero
- **RRR** (2022) - Indian historical action
- And more...

Each movie entry includes:
- Title and release year
- Runtime and genre information
- Director, writers, and cast
- IMDB rating
- Detailed plot summary

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Groq API key
- Nomic AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pop_choice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_API_KEY=your_supabase_anon_key
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_NOMIC_API_KEY=your_nomic_api_key
   ```

4. **Supabase Setup**
   - Create a new Supabase project
   - Enable the pgvector extension
   - Create a `movies` table with columns:
     - `id` (auto-increment primary key)
     - `content` (text)
     - `embedding` (vector(768)) - adjust dimension based on Nomic model
   - Create the `match_movies` RPC function for vector similarity search

5. **Data Ingestion**
   Run the setup function to populate the vector database:
   ```javascript
   import { Setup } from './src/utils/config.js';
   await Setup();
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Supabase Vector Search Function
```sql
CREATE OR REPLACE FUNCTION match_movies(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 3
)
RETURNS TABLE(
  id bigint,
  content text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    movies.id,
    movies.content,
    1 - (movies.embedding <=> query_embedding) AS similarity
  FROM movies
  WHERE 1 - (movies.embedding <=> query_embedding) > match_threshold
  ORDER BY movies.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_API_KEY`: Supabase anonymous/public key
- `VITE_GROQ_API_KEY`: API key from Groq console
- `VITE_NOMIC_API_KEY`: API key from Nomic AI

## 🎯 Usage

1. **Access the Application**: Open the app in your browser
2. **Input Preferences**:
   - Describe your favorite movie and why you love it
   - Specify if you want something new or classic
   - Indicate your mood (fun, serious, adventurous, etc.)
3. **Get Recommendations**: Click "Let's Go" to receive AI-powered suggestions
4. **Explore More**: Use "Go Again" to try different preferences

## 🔍 How It Works

### Step-by-Step Process

1. **User Input Processing**
   - Collects and formats user preferences into a query string
   - Generates embeddings for the combined user input

2. **Semantic Search**
   - Queries vector database with user embedding
   - Retrieves most semantically similar movies
   - Filters results based on similarity threshold

3. **AI Recommendation Generation**
   - Combines retrieved movie data with user interests
   - Uses Groq AI to analyze and generate personalized recommendations
   - Ensures recommendations are relevant and engaging

4. **Result Presentation**
   - Displays recommendations in a user-friendly format
   - Provides option to refine preferences and try again

## 📈 Performance Features

- **Fast Inference**: Groq's optimized hardware for quick AI responses
- **Efficient Search**: Vector similarity search for instant movie matching
- **Scalable Architecture**: Modular design for easy expansion
- **Optimized Chunking**: Smart text splitting for better embedding quality

## 🔒 Security & Privacy

- **Client-side Processing**: Sensitive operations handled securely
- **API Key Protection**: Environment variables for secure key management
- **Data Privacy**: User preferences processed locally before AI analysis

## 🚀 Future Enhancements

- [ ] Expanded movie database with user ratings integration
- [ ] Advanced filtering options (genre, year, director preferences)
- [ ] Social features for sharing recommendations
- [ ] Integration with streaming service APIs
- [ ] Personalized recommendation history and analytics

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For questions or support, please open an issue in the repository.

---

*Built with ❤️ using React, Vite, Supabase, Groq AI, and Nomic embeddings*
