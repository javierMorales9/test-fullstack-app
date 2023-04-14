import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'default',
    env: 'NODE_ENV',
  },
  mongo: {
    url: {
      doc: 'The Mongo connection URL',
      format: String,
      env: 'MONGO_URL',
      default:
        'mongodb+srv://javi:cgSD9gGhQ9L4ayjE@cluster0.yik8e.mongodb.net/usercom?retryWrites=true&w=majority',
    },
  },
});

config.loadFile([
  __dirname + '/default.json',
  __dirname + '/' + config.get('env') + '.json',
]);

export default config;
