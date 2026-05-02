const formatJson = (json) => `${JSON.stringify(json, null, 2)}\n`;

module.exports.readVersion = function readVersion(contents) {
  const json = JSON.parse(contents);

  if (!json.expo || typeof json.expo.version !== 'string') {
    throw new Error('app.json must define expo.version');
  }

  return json.expo.version;
};

module.exports.writeVersion = function writeVersion(contents, version) {
  const json = JSON.parse(contents);

  if (!json.expo) {
    throw new Error('app.json must define expo configuration');
  }

  json.expo.version = version;
  return formatJson(json);
};
