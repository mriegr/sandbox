FROM curlimages/curl:7.78.0 AS downloader

WORKDIR /downloads

RUN set -ex; \
  curl -fL https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize/v4.3.0/kustomize_v4.3.0_linux_amd64.tar.gz | tar xz && \
  chmod +x kustomize

FROM node:16-alpine

ENV APP_DIR /app

COPY --from=downloader /downloads/kustomize /usr/local/bin/kustomize

RUN mkdir ${APP_DIR}
WORKDIR ${APP_DIR}

RUN  apk add --no-cache krb5-libs

COPY package.json yarn.lock ./
RUN apk add --no-cache --virtual .gyp \ 
  g++ gcc libgcc libstdc++ linux-headers make python2 krb5-dev libssh2-dev && \
  yarn install --frozen-lockfile --production && \
  apk del .gyp

COPY . .

CMD ["node", "./main.js"]
