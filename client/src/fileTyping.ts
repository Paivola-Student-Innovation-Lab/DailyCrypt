export {}

declare global{
    interface File extends Blob{
        path?: string;
      }
}