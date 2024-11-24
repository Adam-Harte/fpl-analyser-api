import { app } from './app';

try {
  app.listen(8000, () => {
    console.log('Listening on port 8000');
  });
} catch (err) {
  console.log(err);
}
