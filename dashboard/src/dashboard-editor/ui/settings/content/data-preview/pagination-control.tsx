import { Group, Pagination, Select, Text } from '@mantine/core';
import { SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

const limitOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const selectorStyles = {
  icon: {
    width: '80px',
    textAlign: 'center',
  },
  input: {
    '&[data-with-icon]': {
      paddingLeft: '80px',
    },
  },
};

type Props = {
  data: TQueryData;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<SetStateAction<number>>;
};
export const PaginationControl = ({ data, page, setPage, limit, setLimit }: Props) => {
  const { t } = useTranslation();
  const total = data.length;
  const maxPage = Math.ceil(total / limit);

  const changeLimit = (limit: string) => {
    setPage(1);
    setLimit(Number(limit));
  };

  if (total === 0) {
    return null;
  }

  const hideLimitSelector = maxPage === 1 && total <= 10;
  return (
    <Group pt={10} px={10} position="apart">
      <Group position="left">
        {maxPage > 1 && (
          <Pagination
            size="sm"
            value={page}
            onChange={setPage}
            total={maxPage}
            withEdges={maxPage > 7}
            styles={{ control: { height: '30px' } }}
          />
        )}
        {!hideLimitSelector && (
          <Select
            icon={
              <Text ta="center" color="dimmed" size={14}>
                {t('common.pagination.page_size')}
              </Text>
            }
            size="xs"
            // @ts-expect-error type error caused by !important
            styles={selectorStyles}
            data={limitOptions}
            value={String(limit)}
            onChange={changeLimit}
          />
        )}
      </Group>
      <Group position="right">
        <Text color="dimmed" my={0} size={14}>
          {t('common.pagination.total_rows', { total })}
        </Text>
      </Group>
    </Group>
  );
};
