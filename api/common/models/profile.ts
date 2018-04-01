import { Model } from '@mean-expert/model';
import { Utils as UT } from '../helpers/utils';

/**
 * @module user
 * @description
 * Write a useful user Model description.
 * Register hooks and remote methods within the
 * Model Decorator
 **/

@Model({
  hooks  : {
    beforeSave: {name: 'before save', type: 'operation'}
  },
  remotes: {
    signup: {
      description: 'Signup a user with email/phone username and password.',
      accepts    : {arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},
      returns    : {arg: 'accessToken', type: 'object', root: true},
      http       : {verb: 'post'},
    },
    signin: {
      description: 'Signup a user with email/phone username and password.',
      accepts    : [{arg: 'credentials', type: 'object', required: true, http: {source: 'body'}},],
      returns    : {arg: 'accessToken', type: 'object', root: true,},
      http       : {path: '/signin', verb: 'post'}
    },
    logout: {
      description: 'Logout.',
      accepts    : [
        {arg: 'all', type: 'string'},
        {arg: 'access_token', type: 'string'},
      ],
      returns    : {type: 'string', root: true,},
      http       : {path: '/logout', verb: 'get'}
    },
    info  : {
      description: 'User info.',
      accepts    : [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
      returns    : {type: 'object', root: true,},
      http       : {path: '/info', verb: 'get'}
    }

  }
})
class profile {
  app;
  UserModel;
  AccessTokenModel;
  email;
  utils;

  constructor(public model: any) {
    this.utils = new UT();
    model.getApp((err, app) => {
      this.app = app;
      this.UserModel = app.models.User;
      this.AccessTokenModel = app.models.AccessToken;
      this.reassignEmailValidation();

    })
  }

  reassignEmailValidation() {
    delete this.model.validations.email;
    let validateEmail = this.utils.validateEmail;
    this.model.validate('email', function (err) {
      if (!validateEmail(this.email) && this.email !== undefined) err();
    }, {message: 'Email format is invalid'})
  }

  beforeSave(ctx: any, next: Function): void {
    next();
  }

  signup(credentials, next: Function): void {
    if (credentials.username && credentials.password) {
      this.utils.checkUsername(credentials.username).then((ext) => {
          credentials['usertype'] = ext;
          //if(ext === 'phone') credentials.username = this.utils.sanitizePhone(credentials.username);
          this.model.create(credentials, (err, user) => {
            if (err) {
              next(err.message, null);
            } else {
              this.model.login(credentials, (e, token) => {
                next(null, token);
              })
            }
          });
        }
      ).catch((e) => {
        next("Wrong username format! Only phonenumber or email is allowed.", null);
      });
    } else {
      next("Username & password required.", null);
    }
  }

  signin(credentials, next: Function): void {
    if (credentials.username && credentials.password) {
      this.model.login(credentials, (err, token) => {
        (err) ? next(err.message, null) : next(null, token);
      })
    }
  }

  logout(all, token, next: Function) {
    if (token) {
      if (all && all == "true") {
        this.AccessTokenModel.findOne({id: token}, (err, _token) => {
          if (_token) {
            this.model._invalidateAccessTokensOfUsers([_token.userId], (err) => {
              (err) ? next(err, null) : next(null, null);
            })
          } else {
            next(null, null);
          }
          if (err) return next('Access token not valid!', null);
        })
      } else {
        this.UserModel.logout(token, (err) => {
          (err) ? next(err, null) : next(null, null);
        });
      }
    } else {
      next("Access token required!", null);
    }
  }

  info(options, next) {
    if (options && options.accessToken) {
      this.model.findById(options.accessToken.userId)
          .then((user) => {
            next(null, user)
          })
          .catch((e) => {
              next(e.message, null);
            }
          )
    } else {
      next("Access token required.", null)
    }
  }
}

module.exports = profile;
