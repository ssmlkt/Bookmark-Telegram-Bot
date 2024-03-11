declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ["key"]: string;
    }
  }
}
