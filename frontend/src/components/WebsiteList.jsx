const WebsiteList = ({
  areWebsitesLoading,
  websites,
  deleteWebsite,
  websiteDeletionId,
}) => {
  if (areWebsitesLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="websites-list">
      {websites.length ? (
        websites.map((website) => (
          <div className="website-item" key={website._id}>
            <div className="left">
              <p className={`link ${website.isActive ? "green" : "red"}`}>
                {website.isActive ? "ACTIVE" : "DOWN"}
              </p>
              <p className="url">{website.url}</p>
            </div>

            <div className="right">
              <p
                className="link red"
                onClick={() => deleteWebsite(website._id)}
              >
                {" "}
                {websiteDeletionId === website._id ? "Deleting..." : "Delete"}
              </p>
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
