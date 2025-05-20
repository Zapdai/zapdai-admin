import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: ['@stomp/stompjs', 'sockjs-client']
  }
});
