export function register() {
  if (process.env.NEXT_RUNTIME === "edge") {
    // Edge bundles cannot load node:fs — the edge path is a no-op.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("./register.edge").registerEdge();
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("./register.node").registerNode();
}
