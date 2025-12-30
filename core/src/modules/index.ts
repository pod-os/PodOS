import { Store } from "../Store";

/**
 * Dynamically loads a module by its name and returns an instance of the module
 * @param moduleName
 * @param store
 */
export async function loadModule<T>(
  moduleName: string,
  store: Store,
): Promise<T> {
  const module = await import(moduleName);
  return store.loadModule(module);
}
