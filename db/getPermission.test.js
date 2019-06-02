const getPermission = require('./getPermission');

const mockConnection = {
  _error: false,
  _results: [],
  _fields: [],
  query: function(query, callback){
    if (this._error!== false) {
      callback(this._error, [] /** returns empty */, this._fields);
      return;
    }
    callback(false, this._results, this._fields);
  }
};

describe('Testing db::getPermission', () => {
  test('it should return the permission.', async () => {
    mockConnection._results.push({ type: 'administrator' });
    expect.assertions(1);
    await expect(getPermission(mockConnection, /** userId */ '1qaz2wsx3edc', /** websiteId */ 10)).resolves.toEqual('administrator');
  });

  test('it should return false. Because userId doesnt have a permission', async () => {
    mockConnection._results = [];
    expect.assertions(1);
    await expect(getPermission(mockConnection, /** userId */ '1qaz2wsx3edc', /** websiteId */ 10)).resolves.toEqual(false);
  });

  test('it should return false. Because userId is undefined', async () => {
    mockConnection._results = [];
    expect.assertions(1);
    await expect(getPermission(mockConnection, /** userId */ undefined, /** websiteId */ 10)).resolves.toEqual(false);
  });

  test('it should return false. Because websiteId is undefined', async () => {
    mockConnection._results = [];
    expect.assertions(1);
    await expect(getPermission(mockConnection, /** userId */ '1qaz2wsx3edc', /** websiteId */ undefined)).resolves.toEqual(false);
  });
});