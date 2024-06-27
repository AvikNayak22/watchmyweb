const WebsiteList = ({ loadingWebsites, websites }) => {
  if (loadingWebsites) {
    return <p>Loading...</p>;
  }

  return (
    <div className="cards">
      {websites.length ? (
        websites.map((website) => (
          <div className="card" key={website._id}>
            <div className="left">
              <p className={`link ${website.isActive ? "green" : "red"}`}>
                {website.isActive ? "ACTIVE" : "DOWN"}
              </p>
              <p className="url">{website.url}</p>
            </div>

            <div className="right">
              <p className="link red">{"Delete"}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No Websites Added</p>
      )}
    </div>
  );
};

export default WebsiteList;
