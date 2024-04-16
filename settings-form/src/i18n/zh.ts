export const zh = {
  translation: {
    datasource: {
      label: '数据源',
      add: '添加数据源',
      edit: '编辑数据源',
      connection_info: '连接信息',
      db: {
        host: '主机（host）',
        port: '端口（port）',
        username: '用户名（username）',
        password: '密码（password）',
        database: '数据库（database）',
        permission_tip: '只需具备 <1>SELECT</1> 权限',
      },
      cant_edit: {
        db: '只有HTTP数据源可以编辑',
        preset: '这是预设数据源，不可编辑',
      },
      delete: {
        title: '删除这个数据源？',
        hint: '此操作不会影响您的数据库或HTTP服务',
        cant_delete_preset: '这是预设数据源，不可删除',
      },
      http: {
        base_url: '访问地址',
        processing: {
          pre: {
            label: '查询请求预处理',
            description: '此函数在请求发起前执行（例如加密场景）',
          },
          post: {
            label: '查询请求后处理',
            description: '此函数在请求获得响应后执行（例如解密场景）',
          },
        },
      },
      state: {
        adding: '正在添加数据源...',
        added: '数据源已添加',
        updating: '正在更新数据源...',
        updated: '数据源已更新',
        deleting: '正在删除数据源...',
        deleted: '数据源"{{name}}"已删除',
      },
    },
    account: {
      label: '账户',
    },
    global_sql_snippet: {
      label: '全局SQL片段',
    },
    api_key: {
      label: 'API令牌',
    },
    common: {
      type: '类型',
      name: '名称',
      name_placeholder: '名称须唯一',
      state: {
        pending: '处理中',
        successful: '成功',
        failed: '失败',
      },
      action: '动作',
      actions: {
        edit: '编辑',
        delete: '删除',
        submit: '提交',
        reset_to_default: '还原为默认值',
        cancel: '取消',
        save: '保存',
        confirm: '确认',
      },
    },
  },
};
