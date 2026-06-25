"use client";

import axios from "axios";

const page = () => {
  async function testApi() {
    const res = await axios.post("/api/add-repository", {
      githubUrl: "https://github.com/rajdeep-2004/rally",
    });

    console.log(res.data);
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={testApi}>Test Repository API</button>
    </div>
  );
};

export default page;
