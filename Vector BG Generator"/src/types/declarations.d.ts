// src/types/require-context.d.ts or src/@types/require-context.d.ts
declare module "require-context" {
  interface WebpackRequire {
    context: (
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ) => {
      keys: () => string[];
      (id: string): any;
    };
  }

  const requireContext: WebpackRequire;
  export = requireContext;
}
