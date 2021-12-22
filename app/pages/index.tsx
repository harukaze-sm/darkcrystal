import type { NextPage } from "next";
import Head from "next/head";
import Index from "src/pages";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dark Crystal</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Index />
    </div>
  );
};

export default Home;