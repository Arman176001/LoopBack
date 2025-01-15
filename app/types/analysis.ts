export interface AnalysisResponse {
    result: string
  }
  
  export interface SentimentResponse {
    result: {
      [key: string]: string[]
    }
  }
  
  export interface CommentTimestamp {
    timestamp: string
    count: number
  }
  
  