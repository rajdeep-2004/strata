"use client";

import axios from "axios";

const page = () => {
  // TODO: Remove
  async function testApi() {
    const res = await axios.post("/api/add-repository", {
      githubUrl: "https://github.com/rajdeep-2004/music_school_landingPage",
    });

    alert("DONE")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={testApi}>Test Repository API</button>
    </div>
  );
};

export default page;
