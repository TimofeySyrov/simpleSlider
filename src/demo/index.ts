function importAll(resolve: __WebpackModuleApi.RequireContext): void {
  resolve.keys().forEach(resolve);
}

importAll(require.context('./', true, /\.ts$|\.scss$/));
