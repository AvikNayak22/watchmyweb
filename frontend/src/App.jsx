import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth/Auth";
import AppHeader from "./components/AppHeader";
import WebsiteList from "./components/WebsiteList";

function App() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [loadingWebsites, setLoadingWebsites] = useState(true);
  const [inputUrl, setInputUrl] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const init = async () => {
    const rawTokens = localStorage.getItem("tokens");
    if (!rawTokens) {
      setShowAuth(true);
      setPageLoaded(true);
      return;
    }

    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken;
    const accessTokenExpiry = new Date(accessToken.expireAt);

    if (new Date() > accessTokenExpiry) {
      const res = await fetch("http://localhost:5000/user/new-token", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: tokens?.refreshToken?.token,
        }),
      }).catch((err) => void err);

      if (!res) {
        setPageLoaded(true);
        setShowAuth(true);
        localStorage.removeItem("tokens");
        return;
      }

      const data = await res.json();
      if (!data || data.status) {
        setPageLoaded(true);
        setShowAuth(true);
        localStorage.removeItem("tokens");
        return;
      }

      const newTokens = data.data?.tokens;
      localStorage.setItem("tokens", JSON.stringify(newTokens));

      setPageLoaded(true);
      setShowAuth(false);
    } else {
      setPageLoaded(true);
      setShowAuth(false);
    }

    fetchAllWebsites();
  };

  const fetchAllWebsites = async () => {
    const rawTokens = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken.token;

    const res = await fetch("http://localhost:5000/website", {
      headers: {
        Authorization: accessToken,
      },
    }).catch((err) => void err);

    setLoadingWebsites(false);

    if (!res) {
      return;
    }

    const data = await res.json();

    setWebsites(data.data);
  };

  const addWebsite = async () => {
    if (!inputUrl.trim() || submitButtonDisabled) return;

    setErrorMessage("");

    const rawTokens = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken.token;

    setSubmitButtonDisabled(true);

    const res = await fetch("http://localhost:5000/website", {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: inputUrl,
      }),
    }).catch((err) => void err);

    setSubmitButtonDisabled(false);

    if (!res) {
      setErrorMessage("Error creating website");
      return;
    }

    const data = await res.json();

    if (!data.status) {
      setErrorMessage(data.message);
    }

    setInputUrl("");

    fetchAllWebsites();
  };

  useEffect(() => {
    init();
  }, []);

  if (!pageLoaded) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (showAuth) {
    return <Auth />;
  }

  return (
    <div className="app">
      <div className="inner-app">
        <AppHeader
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          errorMessage={errorMessage}
          addWebsite={addWebsite}
          submitButtonDisabled={submitButtonDisabled}
        />
        <div className="body">
          <p className="heading">Your Websites</p>
          <WebsiteList loadingWebsites={loadingWebsites} websites={websites} />
        </div>
      </div>
    </div>
  );
}

export default App;
