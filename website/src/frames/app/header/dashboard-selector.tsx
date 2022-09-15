import { Select } from '@mantine/core';
import { useRequest } from 'ahooks';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardAPI } from '../../../api-caller/dashboard';

export function DashboardSelector() {
  const { id } = useParams();
  const navigate = useNavigate();
  const changeID = React.useCallback((id: string) => {
    navigate(`/dashboard/${id}`);
  }, []);

  const { data: options = [] } = useRequest(
    async () => {
      const { data } = await DashboardAPI.list();
      return data.map((d) => ({
        label: d.name,
        value: d.id,
      }));
    },
    {
      refreshDeps: [id],
    },
  );

  React.useEffect(() => {
    if (!id && options.length > 0) {
      changeID(options[0].value);
    }
  }, [id, options]);

  const handleChange = React.useCallback((selectedID: string | null) => {
    if (!selectedID) {
      return;
    }
    changeID(selectedID);
  }, []);

  return <Select size="xs" clearable={false} value={id} onChange={handleChange} data={options} />;
}
