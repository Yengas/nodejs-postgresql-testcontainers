module.exports = {
  postgre: {
    image: 'postgres',
    tag: '13.1-alpine',
    ports: [5432],
    env: {
      POSTGRES_PASSWORD: 'integration-pass',
    },
    wait: {
      type: 'text',
      text: 'server started',
    },
  },
};
