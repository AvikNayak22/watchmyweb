const AppHeader = ({
  inputUrl,
  setInputUrl,
  errorMessage,
  addWebsite,
  isSubmitButtonDisabled,
}) => {
  return (
    <div className="app-header">
      <p className="heading">Add website for monitoring</p>

      <div className="elem">
        <label>Enter website URL</label>
        <input
          className="input"
          type="url"
          placeholder="https://example.com"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button onClick={addWebsite} disabled={isSubmitButtonDisabled}>
        {isSubmitButtonDisabled ? "Adding..." : "Add"}
      </button>
    </div>
  );
};

export default AppHeader;
