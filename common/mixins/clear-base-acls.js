'use strict';

const path = require('path');
const appRoot = require('app-root-path');

function slugify(name) {
  name = name.replace(/^[A-Z]+/, s => s.toLowerCase());
  return name.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
}

module.exports = (Model) => {
  const configFile = path.join('./common/models/', slugify(Model.modelName) + '.json');
  const config = appRoot.require(configFile);

  if (!config || !config.acls) {
    console.error('ClearBaseAcls: Failed to load model config from', configFile);
    return;
  }

  Model.settings.acls.length = 0;
  config.acls.forEach(r => Model.settings.acls.push(r));
};