FROM denoland/deno:alpine
USER root

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  nodejs \
  yarn

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache /app/src/main.ts

CMD ["run", "--allow-all", "src/main.ts"]