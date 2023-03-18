<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePyodide } from "./composables/pyodide";
import pyvalidate from "./assets/validate.py?raw";
import vocpub from "./assets/vocpub.ttl?raw";
import vocpubValidData from "./assets/vocpub-valid-data.ttl?raw";
import vocpubInvalidData from "./assets/vocpub-invalid-data.ttl?raw";

const inputShapes = ref("");
const inputData = ref("");
const validationOutput = ref("");

let { initPyodide, isLoading, pyodide } = usePyodide(["pyshacl", "rdflib"]);

onMounted(async () => {
  await initPyodide();

  pyodide.value.runPython(pyvalidate);
});

const onValidate = () => {
  // TODO: Can only trigger validation when no validation is running.
  const pythonCallStr = `validate("""${inputShapes.value}""", """${inputData.value}""")`;
  const [conforms, resultsText] = pyodide.value.runPython(pythonCallStr).toJs();

  validationOutput.value = `${conforms ? "✅" : "❌"}\n${resultsText}`;
};
</script>

<template>
  <v-sheet class="pa-4">
    <h1 class="text-h2">SHACL Validator</h1>
    <p class="text-subtitle-1 font-italic pb-2">
      Powered by pySHACL, Pyodide, Vue and Vuetify
    </p>

    <v-divider class="border-opacity-25 pb-4"></v-divider>

    <div class="d-flex flex-column">
      <div class="pb-3">
        <v-btn
          @click="() => (inputShapes = vocpub)"
          variant="tonal"
          :disabled="isLoading"
          >Load VocPub</v-btn
        >
      </div>
    </div>
    <div>
      <v-textarea
        class="textarea"
        v-model="inputShapes"
        label="Input shapes (Turtle)"
        variant="solo"
        required
        rows="15"
        row-height="12"
      ></v-textarea>
    </div>

    <div class="d-flex flex-column">
      <div class="d-flex flex-row flex-wrap">
        <div class="pb-3 pr-2">
          <v-btn
            @click="() => (inputData = vocpubValidData)"
            variant="tonal"
            :disabled="isLoading"
            >Load VocPub valid data</v-btn
          >
        </div>
        <div class="pb-3 pr-2">
          <v-btn
            @click="() => (inputData = vocpubInvalidData)"
            variant="tonal"
            :disabled="isLoading"
            >Load VocPub invalid data</v-btn
          >
        </div>
      </div>

      <div class="">
        <v-textarea
          class="textarea"
          v-model="inputData"
          label="Input data (Turtle)"
          variant="solo"
          required
          rows="15"
          row-height="12"
        ></v-textarea>
      </div>
    </div>

    <div class="d-flex flex-row-reverse pb-3">
      <div>
        <v-btn @click="() => onValidate()" color="blue" :disabled="isLoading"
          >Validate</v-btn
        >
      </div>
    </div>

    <v-card v-if="validationOutput"
      ><code>
        <pre
          class="pa-3 overflow-auto"
          style="background-color: #262626; color: whitesmoke"
          >{{ validationOutput }}</pre
        >
      </code></v-card
    >
  </v-sheet>
</template>

<style lang="scss" scoped>
@import "./scss/variables.scss";

.textarea :deep(.v-field__input) {
  font-family: $code-font-family;
  font-size: $code-font-size;
  white-space: nowrap;
}
</style>
