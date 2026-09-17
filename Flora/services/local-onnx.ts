// Helpers for running ONNX models on-device (Expo dev build or bare RN).
// Not wired into the UI yet; call loadModelSession(...) and runOnnx(...) once
// you have the converted .onnx files in assets/models/.

import * as ort from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';

export type LoadedModel = {
  session: ort.InferenceSession;
  inputName: string;
  outputName: string;
};

/**
 * Load an ONNX model that was bundled as an Expo asset.
 * Usage:
 *   const plant = await loadModelSession(require('@/assets/models/plant_disease.onnx'));
 */
export async function loadModelSession(moduleRef: any): Promise<LoadedModel> {
  const asset = Asset.fromModule(moduleRef);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('Model asset failed to load locally');
  }

  const session = await ort.InferenceSession.create(asset.localUri);
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];

  return { session, inputName, outputName };
}

export type OnnxPrediction = {
  label: string;
  confidence: number;
};

/**
 * Run inference given a float32 input tensor already preprocessed to
 * the model's expected shape (e.g., [1, 3, 224, 224]).
 */
export async function runOnnx(
  model: LoadedModel,
  input: Float32Array,
  shape: ort.Tensor['dims'],
  labels: string[],
): Promise<OnnxPrediction> {
  const tensor = new ort.Tensor('float32', input, shape);
  const outputs = await model.session.run({ [model.inputName]: tensor });
  const output = outputs[model.outputName];
  const scores = Array.from(output.data as Float32Array);

  let bestIdx = 0;
  for (let i = 1; i < scores.length; i += 1) {
    if (scores[i] > scores[bestIdx]) bestIdx = i;
  }

  return {
    label: labels[bestIdx] ?? 'Unknown',
    confidence: scores[bestIdx] ?? 0,
  };
}

