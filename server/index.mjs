import express from "express";
import passport from "passport";
import { default as PassportHttp } from "passport-http";
import Cryptr from "cryptr";
import dotEnv from "dotenv";
import { Model } from "./Model.mjs";
import { addCrudRouter } from "./addCrudRouter.mjs";

dotEnv.config();

const app = express();
const port = 3000;
const logger = console.log;
const debug = true;

const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

const superAdmin = {
  username: process.env.SUPER_USER_NAME,
  password: process.env.SUPER_USER_PWD,
  emailId: process.env.SUPER_USER_EMAIL_ID,
  admin: true,
};

const userModelDefault =
  superAdmin.username && superAdmin.password && superAdmin.emailId
    ? { data: [superAdmin] }
    : null;

const Users = new Model("users.enc", {
  serialize(data) {
    return cryptr.encrypt(JSON.stringify(data));
  },
  deserialize(data) {
    return JSON.parse(cryptr.decrypt(data));
  },
  ...(userModelDefault ? { defaultValue: userModelDefault } : {}),
});

app.use((req, _, next) => {
  if (debug) {
    logger(`Logging requests: ${req.url}, ${req.method}`);
  }
  next();
});

const AdminDigestKey = "admin";
const NonAdminDigestKey = "non-admin";
const genDigestStrategy = (admin = false) => {
  return new PassportHttp.DigestStrategy(
    { qop: "auth" },
    function (username, cb) {
      try {
        const [user = null] = Users.readRec({
          filter: { key: "username", value: username },
        });
        if (user) {
          if (admin) {
            if (user.admin) {
              return cb(null, user.username, user.password);
            }
            return cb(null, false);
          }
          return cb(null, user.username, user.password);
        }
        return cb(null, false);
      } catch (err) {
        return cb(err);
      }
    }
  );
};

passport.use(AdminDigestKey, genDigestStrategy(true));

passport.use(NonAdminDigestKey, genDigestStrategy(false));

const auth = (key) => {
  return passport.authenticate(key, {
    session: false,
  });
};

const Students = new Model("students");
addCrudRouter(app, "/student", Students, auth(NonAdminDigestKey));

const Courses = new Model("courses");
addCrudRouter(app, "/course", Courses, auth(NonAdminDigestKey));

addCrudRouter(app, "/user", Users, auth(AdminDigestKey));

app.listen(port, () => {
  logger(`server started on host/3000`);
});

export { app };
