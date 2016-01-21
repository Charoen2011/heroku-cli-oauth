'use strict';

let co  = require('co');
let cli = require('heroku-cli-util');
let lib = require('../../lib');

function* run (context, heroku) {
  let url = context.args['redirect_uri'];
  lib.validateURL(url);
  let request = heroku.request({
    method:  'POST',
    path:    '/oauth/clients',
    body: {
      name: context.args.name,
      redirect_uri: url,
    }
  });
  let client = yield cli.action(`Creating ${context.args.name}`, request);
  cli.log(`HEROKU_OAUTH_ID=${client.id}`);
  cli.log(`HEROKU_OAUTH_SECRET=${client.secret}`);
}

module.exports = {
  topic:       'clients',
  command:     'create',
  description: 'create a new OAuth client',
  needsAuth:   true,
  args:        [{name: 'name'}, {name: 'redirect_uri'}],
  run: cli.command(co.wrap(run))
};
