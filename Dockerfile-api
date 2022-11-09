FROM registry.cn-hongkong.aliyuncs.com/merico/node:lts_base_v2    

ENV YARN_NPM_REGISTRY_SERVER=https://registry.npmmirror.com

COPY api /code/api

WORKDIR /code/api

RUN yarn install
