import React, { useState } from "react";
import { useRouter } from "next/router";

export const Dashboard = () => {
  const [whoami, setWhoami] = useState("");
  const [error, setError] = useState("");
  const route = useRouter();

  React.useEffect(() => {
    if (route.isReady) {
      console.log("query--", route.query.jwt);

      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/accounts/whoami/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + route.query.jwt,
        },
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let whoami = data.username;
          setWhoami(whoami);
          console.log("whoami", whoami);
        })
        .catch((err) => {
          console.log(err);
          setError("You are not logged in");
        });
    }
  }, [route.query]);

  return (
    <div className="container">
      <h2> Welcome {whoami} </h2>
    </div>
  );
};

export default Dashboard;
