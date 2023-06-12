import { GenderPipe } from './gender.pipe';

describe('GenderPipe', () => {
  const pipe = new GenderPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform Male to Homme', () => {
    expect(pipe.transform('Male')).toBe('Homme');
  });

  it('transform Female to Femme', () => {
    expect(pipe.transform('Female')).toBe('Femme');
  });
});
