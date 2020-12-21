import { Login } from "./components";
import { loggedIn } from "./App.atom";
import {
  Home,
  AuthHome,
  StudentList,
  CourseList,
  StudentAddEdit,
  CourseAddEdit,
} from "./components";
import { Switch, Redirect, Route } from "react-router-dom";
import { useAtomValue } from "jotai/utils";
import { withValid as withValidRouter } from "./utils";

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
          renderIfValid: StudentList,
        })}
      />
      <Route
        exact
        path="/student/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: StudentAddEdit,
        })}
      />
      <Route
        exact
        path="/student/edit/:id"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: StudentAddEdit,
        })}
      />
      <Route
        exact
        path="/course/list"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseList,
        })}
      />
      <Route
        exact
        path="/course/add"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseAddEdit,
        })}
      />
      <Route
        exact
        path="/course/edit/:id"
        component={withValidRouter({
          isValid: renderIfLoggedIn,
          renderIfValid: CourseAddEdit,
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
