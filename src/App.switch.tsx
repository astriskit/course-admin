// @ts-nocheck
import { Login } from "./components";
import { loggedIn } from "./App.atom";
import { Home, AuthHome } from "./components";
import { Switch, Redirect, Route, withRouter } from "react-router-dom";
import { useAtomValue } from "jotai/utils";
import { withValid } from "./utils";

const Courses = () => <div>Hello Courses!</div>;
const Students = () => <div>Hello Students</div>;

const withValidRouter = (c) => withRouter(withValid(c));

export const AppSwitch = () => {
  const isLoggedIn = useAtomValue(loggedIn);

  const renderIfLoggedIn = () => isLoggedIn;
  const renderIfNotLoggedIn = () => !isLoggedIn;

  return (
    <Switch>
      <Route
        exact
        path="/student/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Students,
        })}
      />
      <Route
        exact
        path="/student/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Students,
        })}
      />
      <Route
        exact
        path="/student/edit"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Students,
        })}
      />
      <Route
        exact
        path="/course/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Courses,
        })}
      />
      <Route
        exact
        path="/course/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Courses,
        })}
      />
      <Route
        exact
        path="/course/edit"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: Courses,
        })}
      />
      <Route
        exact
        path="/login"
        component={withValidRouter({
          isValid: renderIfNotLoggedIn,
          renderIfValid: Login,
        })}
      />
      <Route
        exact
        path="/"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: AuthHome,
          renderIfNotValid: Home,
        })}
      />
      <Redirect to="/login" />
    </Switch>
  );
};
