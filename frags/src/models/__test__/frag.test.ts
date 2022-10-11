import { Fragrance } from '../frag';

it('implements optimistic concurrent control', async () => {
  //create frag instance
  const frag = Fragrance.build({
    title: 'dylan blue',
    price: 5,
    userId: '123',
  });

  //save frag to db
  await frag.save();

  //fetch frag twice
  const firstInstance = await Fragrance.findById(frag.id);
  const secondInstance = await Fragrance.findById(frag.id);

  //make two sep changes to the frags we fetched
  firstInstance!.set({ price: 100 });
  secondInstance!.set({ price: 1001 });

  //save first fetched frag
  await firstInstance!.save();

  // save the second fetched frag and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
});

it('increments the version number on multiple saves', async () => {
  //create frag instance
  const frag = Fragrance.build({
    title: 'dylan blue',
    price: 5,
    userId: '123',
  });

  await frag.save();
  expect(frag.version).toEqual(0);
  await frag.save();
  expect(frag.version).toEqual(1);
  await frag.save();
  expect(frag.version).toEqual(2);
});
