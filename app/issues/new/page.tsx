import React from 'react';
import dynamic from 'next/dynamic';
import IssueFormSkeleton from '../_components/IssueFormSkeleton';
const IssueForm = dynamic(() => import('../_components/issueForm'), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

const NewIssuePage = () => {
  return <IssueForm />;
};

export default NewIssuePage;
