import React from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import DefaultErrorPage from 'next/error';
import Head from 'next/head';

builder.init('568d99a788b34273b6c5c577e85c4a69');

export async function getStaticProps({ params }) {
  const page = await builder
    .get('page', {
      userAttributes: { urlPath: '/' + (params?.page?.join('/') || '') },
    })
    .toPromise();

  return {
    props: { page: page || null },
    revalidate: 5,
  };
}

export async function getStaticPaths() {
  const pages = await builder.getAll('page', {
    fields: 'data.url',
    options: { noTargeting: true },
  });

  return {
    paths: pages.map((page) => page.data?.url).filter(Boolean),
    fallback: 'blocking',
  };
}

export default function Page({ page }) {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <>
      <Head>
        <title>{page?.data?.title}</title>
      </Head>
      <BuilderComponent model="page" content={page} />
    </>
  );
}
