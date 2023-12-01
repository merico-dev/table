import { Box, Button, FileInput, Group, Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEditContentModelContext } from '~/contexts';
import { CURRENT_SCHEMA_VERSION } from '~/model';
import { TDashboardContent } from '~/types';
import { ExplainJSONSchema } from './explain-json-schema';
import { validateDashboardJSONFile } from './validate';

interface IFormValues {
  content: Partial<TDashboardContent> | null;
}

type Props = {
  onSuccess: () => void;
  stretchModal: () => void;
  shrinkModal: () => void;
};

export const ImportWithSchemaForm = observer(({ onSuccess, stretchModal, shrinkModal }: Props) => {
  const model = useEditContentModelContext();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<IFormValues>({
    defaultValues: {
      content: null,
    },
  });

  const updateDashboardWithJSON = ({ content }: IFormValues) => {
    try {
      if (!content) {
        throw new Error('please use a valid json file');
      }
      model.applyJSONSchema(content);
      showNotification({
        title: 'Successful',
        message: '',
        color: 'green',
      });
      onSuccess();
    } catch (error: $TSFixMe) {
      console.error(error);
      showNotification({
        title: 'Failed',
        message: error.message,
        color: 'red',
      });
    }
  };

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsText(file, 'UTF-8');
    fileReader.onload = (e) => {
      try {
        const content = validateDashboardJSONFile(e);
        setValue('content', content);
        clearErrors('content');
      } catch (error: $TSFixMe | ErrorOptions) {
        console.error(error);
        setError('content', { type: 'custom', message: error.message });
      }
    };
    fileReader.onabort = () => console.log('🟨 abort');
    fileReader.onerror = () => {
      if (fileReader.error) {
        console.error(fileReader.error);
        setError('content', { type: 'custom', message: fileReader.error.message });
      }
    };
  }, [file]);

  const [content] = watch(['content']);
  const disabled = !content;
  const contentErrorMessage = errors?.content?.message;

  useEffect(() => {
    if (!content || contentErrorMessage) {
      shrinkModal();
    } else {
      stretchModal();
    }
  }, [content, contentErrorMessage]);

  return (
    <Box mx="auto" sx={{ position: 'relative' }}>
      <form onSubmit={handleSubmit(updateDashboardWithJSON)}>
        <FileInput
          label="JSON File"
          required
          value={file}
          onChange={setFile}
          error={errors?.content?.message}
          sx={{ maxWidth: 500 }}
        />
        {contentErrorMessage ? (
          <Table fontSize={12} mt={10}>
            <tbody>
              <tr>
                <th>Dashboard</th>
                <td>{CURRENT_SCHEMA_VERSION}</td>
              </tr>
              <tr>
                <th>This file</th>
                <td style={{ color: 'red' }}>{content?.version}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <>
            <ExplainJSONSchema content={content} />
            <Group position="right" my="md">
              <Button type="submit" color="green" disabled={disabled}>
                Confirm
              </Button>
            </Group>
          </>
        )}
      </form>
    </Box>
  );
});
