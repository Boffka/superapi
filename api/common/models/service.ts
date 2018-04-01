import { Model } from '@mean-expert/model';
import { Utils as UT } from '../helpers/utils';
var RemoteRouting = require('loopback-remote-routing');

/**
 * @module service
 * @description
 * Write a useful service Model description.
 * Register hooks and remote methods within the
 * Model Decorator
 **/
@Model({
  hooks  : {},
  remotes: {
    latency: {
      accepts    : {arg: 'URI', type: 'string'},
      returns    : {root: true, type: 'object'},
      http       : {path: '/latency', verb: 'get'},
      description: 'Supported protocols: http|https|ftp. Default ping: https://google.com'
    }
  }
})
class service {
  utils;

  constructor(public model: any) {
    this.utils = new UT();
  }

  beforeSave(ctx: any, next: Function): void {
    next();
  }
  latency(URI, next: Function): void {
    let link;
    if (URI) {
      if (this.utils.matchUrl(URI)) {
        link = URI
      } else {
        return next('Wrong URI format!', null);
      }
    } else {
      link = 'https://google.com'
    }
    this.utils.checkLatency(link)
        .then(ms => {
          next(null, {source: link, latency: `${ms}ms`});
        })
        .catch(e => {
          next(e.message, null)
        });
  }
}

module.exports = service;
