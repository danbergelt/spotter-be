import { parseWrite } from '../../../utils/parseWrite';
import assert from 'assert';

describe('parse a mongo write', () => {
  it('returns the written object', () => {
    const write = parseWrite({ ops: ['foo'] } as any);
    assert.equal(write, 'foo');
  });
});
