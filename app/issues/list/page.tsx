import prisma from '@/prisma/client';
import { Table } from '@radix-ui/themes';
import { IssueStatusBadge, Link } from '../../components';
import IssueActions from './IssueActions';
import { Issue, Status } from '@prisma/client';
import NextLink from 'next/link';
import { ArrowDownIcon, ArrowUpIcon } from '@radix-ui/react-icons';
import Pagination from '../_components/Pagination';

type Props = {
  searchParams: {
    status: Status;
    orderBy: keyof Issue;
    orderDir: 'asc' | 'desc';
    page: string;
  };
};

const IssuesPage = async ({ searchParams }: Props) => {
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: 'Issue', value: 'title' },
    { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
    { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
  ];
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const where = { status };

  const orderBy = columns.map((col) => col.value).includes(searchParams.orderBy)
    ? {
        [searchParams.orderBy]: ['asc', 'desc'].includes(searchParams.orderDir)
          ? searchParams.orderDir
          : 'asc',
      }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  const getSortQueryParams = (columnName: string) => {
    let orderDir = 'asc';
    if (
      searchParams.orderBy === columnName &&
      searchParams.orderDir === 'asc'
    ) {
      orderDir = 'desc';
    }
    return {
      orderBy: columnName,
      orderDir,
    };
  };

  const getSortIcon = (columnName: string) => {
    if (columnName === searchParams.orderBy) {
      if (searchParams.orderDir === 'asc') {
        return <ArrowUpIcon className='inline' />;
      }
      if (searchParams.orderDir === 'desc') {
        return <ArrowDownIcon className='inline' />;
      }
    }
    return null;
  };

  return (
    <div>
      <IssueActions />
      <Table.Root variant='surface'>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                key={column.value}
                className={column.className}
              >
                <NextLink
                  href={{
                    query: {
                      ...searchParams,
                      ...getSortQueryParams(column.value),
                    },
                  }}
                >
                  {column.label}
                </NextLink>
                {getSortIcon(column.value)}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.RowHeaderCell>
                <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
                <div className='block md:hidden'>
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.RowHeaderCell>
              <Table.Cell className='hidden md:table-cell'>
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className='hidden md:table-cell'>
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default IssuesPage;
