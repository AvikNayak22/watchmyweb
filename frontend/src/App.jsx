import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth/Auth";
import AppHeader from "./components/AppHeader";
import WebsiteList from "./components/WebsiteList";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [websites, setWebsites] = useState([]);
  const [areWebsitesLoading, setAreWebsitesLoading] = useState(true);
  const [inputUrl, setInputUrl] = useState("");
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [websiteDeletionId, setWebsiteDeletionId] = useState("");

  const init = async () => {
    const rawTokens = localStorage.getItem("tokens");
    if (!rawTokens) {
      setIsAuthenticated(false);
      setIsPageLoaded(true);
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
        setIsPageLoaded(true);
        setIsAuthenticated(false);
        localStorage.removeItem("tokens");
        return;
      }

      const data = await res.json();
      if (!data || data.status) {
        setIsPageLoaded(true);
        setIsAuthenticated(false);
        localStorage.removeItem("tokens");
        return;
      }

      const newTokens = data.data?.tokens;
      localStorage.setItem("tokens", JSON.stringify(newTokens));

      setIsPageLoaded(true);
      setIsAuthenticated(true);
    } else {
      setIsPageLoaded(true);
      setIsAuthenticated(true);
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

    setAreWebsitesLoading(false);

    if (!res) {
      return;
    }

    const data = await res.json();

    setWebsites(data.data);
  };

  const addWebsite = async () => {
    if (!inputUrl.trim() || isSubmitButtonDisabled) return;

    setErrorMessage("");

    const rawTokens = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken.token;

    setIsSubmitButtonDisabled(true);

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

    setIsSubmitButtonDisabled(false);

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

  const deleteWebsite = async (id) => {
    if (websiteDeletionId) return;

    const rawTokens = localStorage.getItem("tokens");
    const tokens = JSON.parse(rawTokens);
    const accessToken = tokens.accessToken.token;

    setWebsiteDeletionId(id);

    const res = await fetch(`http://localhost:5000/website/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: accessToken,
      },
    }).catch((err) => void err);

    setWebsiteDeletionId("");

    if (!res) return;

    fetchAllWebsites();
  };

  useEffect(() => {
    init();
  }, []);

  if (!isPageLoaded) {
    return (
      <div className="loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
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
          isSubmitButtonDisabled={isSubmitButtonDisabled}
        />
        <div className="body">
          <p className="heading">Your Websites</p>
          <WebsiteList
            areWebsitesLoading={areWebsitesLoading}
            websites={websites}
            deleteWebsite={deleteWebsite}
            websiteDeletionId={websiteDeletionId}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
