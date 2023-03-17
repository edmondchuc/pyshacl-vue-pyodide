import { ref } from "vue";
import { loadPyodide } from "pyodide";

export function usePyodide(packages: string[] = []) {
  const pyodide = ref<any>(null);
  const isLoading = ref<boolean>(true);

  const initPyodide = async () => {
    pyodide.value = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/",
    });

    if (packages && pyodide.value != null) {
      await pyodide.value.loadPackage("setuptools");
      await pyodide.value.loadPackage("micropip");
      const micropip = pyodide.value.pyimport("micropip");

      for (const p of packages) {
        await micropip.install(p);
      }
    }

    isLoading.value = false;
  };

  return { pyodide, initPyodide, isLoading };
}
