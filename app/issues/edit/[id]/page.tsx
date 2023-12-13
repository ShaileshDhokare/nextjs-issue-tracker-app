import prisma from '@/prisma/client';
import dynamic from 'next/dynamic';
const IssueForm = dynamic(() => import('../../_components/issueForm'), {
  ssr: false,
  loading: () => <IssueFormSkeleton />,
});

import { notFound } from 'next/navigation';
import IssueFormSkeleton from './loading';

interface Props {
  params: { id: string };
}

const EditIssuePage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) notFound();

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
