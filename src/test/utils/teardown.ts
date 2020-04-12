import wipe from './wipe';

after(async () => {
  await wipe();
});
