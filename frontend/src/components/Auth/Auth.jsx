import { useEffect, useState } from "react";
import "./Auth.css";

import { validateEmail } from "../../utils/helper";

const Auth = () => {
  const [signupActive, setSignupActive] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    if (submitButtonDisabled) return;

    if (!values.name.trim() || !values.email.trim() || !values.password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!validateEmail(values.email)) {
      setErrorMessage("Email is not valid");
      return;
    }

    if (values.password.length < 6) {
      setErrorMessage("password must be of 6 characters");
      return;
    }

    setErrorMessage("");

    setSubmitButtonDisabled(true);

    const response = await fetch("http://localhost:5000/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email,
        password: values.password,
      }),
    }).catch((err) =>
      setErrorMessage("Error creating the user : ", err.message)
    );

    setSubmitButtonDisabled(false);

    if (!response) {
      setErrorMessage("Error creating the user");
      return;
    }

    const data = await response.json();

    if (!data.status) {
      setErrorMessage(data.message);
      return;
    }

    const tokens = data.data.tokens;
    localStorage.setItem("tokens", JSON.stringify(tokens));

    window.location.reload();
  };

  const handleLogin = async () => {
    if (submitButtonDisabled) return;

    if (!values.email.trim() || !values.password) {
      setErrorMessage("All fields are required");
      return;
    }

    if (!validateEmail(values.email)) {
      setErrorMessage("Email is not valid");
      return;
    }

    if (values.password.length < 6) {
      setErrorMessage("password must be of 6 characters");
      return;
    }

    setErrorMessage("");

    setSubmitButtonDisabled(true);

    const response = await fetch("http://localhost:5000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    }).catch((err) => setErrorMessage("Error logging in : ", err.message));

    setSubmitButtonDisabled(false);

    if (!response) {
      setErrorMessage("Error logging in");
      return;
    }

    const data = await response.json();

    if (!data.status) {
      setErrorMessage(data.message);
      return;
    }

    const tokens = data.data.tokens;
    localStorage.setItem("tokens", JSON.stringify(tokens));

    window.location.reload();
  };

  useEffect(() => {
    setValues({});
  }, [signupActive]);

  //sign up
  const signupComponent = (
    <div className="box signup">
      <p className="heading">Sign up</p>

      <div className="elem">
        <label>Name</label>
        <input
          className="input"
          type="text"
          placeholder="Enter name"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, name: e.target.value }));
          }}
        />
      </div>
      <div className="elem">
        <label>Email</label>
        <input
          className="input"
          type="email"
          placeholder="Enter email"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, email: e.target.value }));
          }}
        />
      </div>
      <div className="elem">
        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, password: e.target.value }));
          }}
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button onClick={handleSignup} disabled={submitButtonDisabled}>
        {submitButtonDisabled ? "Signing up..." : "Signup"}
      </button>

      <p className="bottom-text">
        Already a user ?{" "}
        <span onClick={() => setSignupActive(false)}>Login here</span>
      </p>
    </div>
  );

  //login
  const loginComponent = (
    <div className="box login">
      <p className="heading">Login</p>

      <div className="elem">
        <label>Email</label>
        <input
          className="input"
          type="email"
          placeholder="Enter email"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, email: e.target.value }));
          }}
        />
      </div>
      <div className="elem">
        <label>Password</label>
        <input
          className="input"
          type="password"
          placeholder="Enter password"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, password: e.target.value }));
          }}
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button onClick={handleLogin} disabled={submitButtonDisabled}>
        {submitButtonDisabled ? "Logging in..." : "Login"}
      </button>

      <p className="bottom-text">
        New user ?{" "}
        <span onClick={() => setSignupActive(true)}>Sign up here</span>
      </p>
    </div>
  );

  return (
    <div className="container">
      {signupActive ? signupComponent : loginComponent}
    </div>
  );
};

export default Auth;
