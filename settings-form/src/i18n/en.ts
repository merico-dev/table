export const en = {
  translation: {
    datasource: {
      label: 'Data Source',
      add: 'Add a data source',
      edit: 'Edit data source',
      connection_info: 'Connection Info',
      db: {
        host: 'Host',
        port: 'Port',
        username: 'Username',
        password: 'Password',
        database: 'Database',
        permission_tip: 'Only <1>SELECT</1> privilege is needed.',
      },
      cant_edit: {
        db: 'Only HTTP datasources can be edited',
        preset: 'This is a preset datasource, it can not be changed',
      },
      delete: {
        title: 'Delete this data source?',
        hint: "This action won't affect your database or HTTP service.",
        cant_delete_preset: 'This is a preset datasource, it can not be deleted',
      },
      http: {
        base_url: 'Base URL',
        processing: {
          pre: {
            label: 'Pre processing of queries',
            description: 'This function will run before sending the request (for scenarios like encryption)',
          },
          post: {
            label: 'Post processing of queries',
            description: 'This function will run after getting a response (for scenarios like decryption)',
          },
        },
      },
      state: {
        adding: 'Adding data source...',
        added: 'Data source is added',
        updating: 'Updating data source...',
        updated: 'Data source is updated',
        deleting: 'Deleting data source...',
        deleted: 'Data source [{{name}}] is deleted',
      },
    },
    account: {
      label: 'Account',
    },
    global_sql_snippet: {
      label: 'Global SQL Snippet',
      add: 'Add a snippet',
      edit: 'Edit snippet',
      content: 'Content',
      state: {
        adding: 'Adding snippet...',
        added: 'Snippet is added',
        updating: 'Updating snippet...',
        updated: 'Snippet is updated',
        deleting: 'Deleting snippet...',
        deleted: 'Snippet [{{name}}] is deleted',
      },
      delete: 'Delete this snippet?',
    },
    api_key: {
      label: 'API Key',
      add: 'Add an API Key',
      edit: 'Edit API key',
      app_id: 'APP ID',
      app_secret: 'APP Secret',
      state: {
        adding: 'Adding API key...',
        added: 'API key is added',
        updating: 'Updating API key...',
        updated: 'API Key is updated',
        deleting: 'Deleting API key...',
        deleted: 'API key [{{name}}] is deleted',
      },
      save: {
        title: 'API Key is generated',
        warn: "Make sure you save it - you won't be able to access it again.",
        saved: "I've saved this API Key",
      },
      delete: 'Delete this key?',
    },
    role: {
      label: 'Role',
    },
    common: {
      type: 'Type',
      name: 'Name',
      name_placeholder: 'A unique name',
      created_at: 'Created At',
      updated_at: 'Updated At',
      state: {
        pending: 'Pending',
        successful: 'Successful',
        failed: 'Failed',
      },
      action: 'Action',
      actions: {
        edit: 'Edit',
        delete: 'Delete',
        submit: 'Submit',
        reset_to_default: 'Reset to default',
        cancel: 'Cancel',
        save: 'Save',
        confirm: 'Confirm',
      },
    },
  },
};
