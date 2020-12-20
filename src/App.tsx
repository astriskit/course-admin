import "antd/dist/antd.css";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "jotai";
import { AppLayout as Layout } from "./components";
import { AppSwitch } from "./App.switch";

function App() {
  return (
    <Router>
      <Provider>
        <Layout>
          <AppSwitch />
        </Layout>
      </Provider>
    </Router>
  );
}

export default App;
