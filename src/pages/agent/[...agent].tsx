import { type NextPage } from "next";
import DefaultLayout from "../../layout/default";
import Button from "../../components/Button";

import React from "react";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <DefaultLayout className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-center text-4xl font-bold text-[#C0C0C0]">
      马上就来！{" "}
      </h1>
      <Button onClick={() => void router.push("/")}>返回</Button>
    </DefaultLayout>
  );
};

export default Home;
