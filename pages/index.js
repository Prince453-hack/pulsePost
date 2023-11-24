import ComponentModal from "@/components/ComponentModal";
import Feed from "@/components/Feed";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import React from "react";

export default function index({ newsResult, randomUsers }) {
  return (
    <div className="flex min-h-screen mx-auto">
      <Sidebar />
      <Feed />
      <Widgets
        newsResult={newsResult.articles}
        randomUsers={randomUsers.results}
      />

      <ComponentModal />
    </div>
  );
}

export async function getServerSideProps() {
  const newsResult = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/business/in.json"
  ).then((res) => res.json());

  const randomUsers = await fetch(
    "https://randomuser.me/api/?nat=IN&results=30&inc=name,login,picture"
  ).then((res) => res.json());

  return {
    props: {
      newsResult,
      randomUsers,
    },
  };
}
