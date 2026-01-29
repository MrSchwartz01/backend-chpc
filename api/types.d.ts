// Tipos para Vercel Serverless Functions
declare global {
  namespace NodeJS {
    interface Global {
      __verceldist: any;
    }
  }
}

export {};