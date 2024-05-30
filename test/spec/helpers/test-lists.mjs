const PATH_TO_TEST = `test/spec/main`;

const patch = [
  `node ${PATH_TO_TEST}/adPodSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/apiSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/companionSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/errorSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/iconsSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/inlineLinearSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/nonLinearSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/omWebSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/outstreamSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/redirectSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/vast4Spec.mjs chrome`,
  `node ${PATH_TO_TEST}/vpaidSpec.mjs chrome`
];

const desktop = [
  `node ${PATH_TO_TEST}/adPodSpec.mjs`,
  `node ${PATH_TO_TEST}/adPodSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/apiSpec.mjs`,
  `node ${PATH_TO_TEST}/apiSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/companionSpec.mjs`,
  `node ${PATH_TO_TEST}/companionSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/errorSpec.mjs`,
  `node ${PATH_TO_TEST}/errorSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/iconsSpec.mjs`,
  `node ${PATH_TO_TEST}/iconsSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/inlineLinearSpec.mjs`,
  `node ${PATH_TO_TEST}/inlineLinearSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/nonLinearSpec.mjs`,
  `node ${PATH_TO_TEST}/nonLinearSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/omWebSpec.mjs`,
  `node ${PATH_TO_TEST}/omWebSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/outstreamSpec.mjs`,
  `node ${PATH_TO_TEST}/outstreamSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/redirectSpec.mjs`,
  `node ${PATH_TO_TEST}/redirectSpec.mjs chrome`,
  `node ${PATH_TO_TEST}/vast4Spec.mjs chrome`,
  `node ${PATH_TO_TEST}/vpaidSpec.mjs`,
  `node ${PATH_TO_TEST}/vpaidSpec.mjs chrome`
];

const android = [
  `node ${PATH_TO_TEST}/adPodSpec.mjs android`,
  `node ${PATH_TO_TEST}/apiSpec.mjs android`,
  `node ${PATH_TO_TEST}/companionSpec.mjs android`,
  `node ${PATH_TO_TEST}/errorSpec.mjs android`,
  `node ${PATH_TO_TEST}/iconsSpec.mjs android`,
  `node ${PATH_TO_TEST}/inlineLinearSpec.mjs android`,
  `node ${PATH_TO_TEST}/nonLinearSpec.mjs android`,
  `node ${PATH_TO_TEST}/outstreamSpec.mjs android`,
  `node ${PATH_TO_TEST}/redirectSpec.mjs android`,
  `node ${PATH_TO_TEST}/vpaidSpec.mjs android`
];

const safari = [
  `node ${PATH_TO_TEST}/adPodSpec.mjs safari`,
  `node ${PATH_TO_TEST}/apiSpec.mjs android`,
  `node ${PATH_TO_TEST}/companionSpec.mjs safari`,
  `node ${PATH_TO_TEST}/errorSpec.mjs safari`,
  `node ${PATH_TO_TEST}/iconsSpec.mjs android`,
  `node ${PATH_TO_TEST}/inlineLinearSpec.mjs safari`,
  `node ${PATH_TO_TEST}/nonLinearSpec.mjs safari`,
  `node ${PATH_TO_TEST}/outstreamSpec.mjs safari`,
  `node ${PATH_TO_TEST}/redirectSpec.mjs safari`,
  `node ${PATH_TO_TEST}/vpaidSpec.mjs safari`
];

export default {
  patch,
  desktop,
  android,
  safari
};
