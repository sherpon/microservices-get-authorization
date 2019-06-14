

jest.mock('firebase-admin');
jest.mock('@google-cloud/firestore');

const getMocks = () => {
  let __mockReq = {
    headers: {},
    get: function(header) {
      return this.headers[header];
    },
    method: '',
    body: {},
    query: {},
    params: {},
  };

  let __mockRes = {
    set: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
    status: jest.fn(),
  };

  return {
    req: __mockReq,
    res: __mockRes,
  };
};

describe('Test getAuthorization', () => {

  test('It should return authorized user.', async () => {
    const microservice = require('./index');
    const firebaseUser = {
      token: '1qaz2wsx3edc4rfv',
      uid: '0okm9ijn8uhb',
    };
    const user = {
      userId: '0okm9ijn8uhb',
    };
    require('firebase-admin').__setMockUser(firebaseUser);
    let mocks = getMocks();
    mocks.req.headers.authorization = `Beare ${firebaseUser.token}`;
    mocks.req.method = 'POST';
    mocks.req.body = user;
    await microservice.getAuthorization(mocks.req, mocks.res);
    expect(mocks.res.status.mock.calls[0][0]).toBe(202);
    expect(mocks.res.end.mock.calls.length).toBe(1);
  });

  test('It should return unauthorized user.', async () => {
    const microservice = require('./index');
    const firebaseUser = {
      token: '1qaz2wsx3edc4rfv',
      uid: '0okm9ijn8uhb',
    };
    const user = {
      userId: '0okm9ijn8uhb_',
    };
    require('firebase-admin').__setMockUser(firebaseUser);
    let mocks = getMocks();
    mocks.req.headers.authorization = `Beare ${firebaseUser.token}`;
    mocks.req.method = 'POST';
    mocks.req.body = user;
    await microservice.getAuthorization(mocks.req, mocks.res);
    expect(mocks.res.status.mock.calls[0][0]).toBe(401);
    expect(mocks.res.end.mock.calls.length).toBe(1);
  });

  test('It should return authorized user-website.', async () => {
    const microservice = require('./index');
    const firebaseUser = {
      token: '1qaz2wsx3edc4rfv',
      uid: '0okm9ijn8uhb',
    };
    const mockBody = {
      userId: '0okm9ijn8uhb',
      websiteId: '111',
    };
    const mockResultArray = [
      { // getPermission
        exists: true,
        data: () => ({
          permissions: {
            '0okm9ijn8uhb': 'administrator',
          },
        }),
      }
    ]
    require('firebase-admin').__setMockUser(firebaseUser);
    require('@google-cloud/firestore').__setMockResultArray(mockResultArray);
    const mocks = getMocks();
    mocks.req.headers.authorization = `Beare ${firebaseUser.token}`;
    mocks.req.method = 'POST';
    mocks.req.body = mockBody;
    await microservice.getAuthorization(mocks.req, mocks.res);
    expect(mocks.res.status.mock.calls[0][0]).toBe(202);
    expect(mocks.res.send.mock.calls.length).toBe(1);
    expect(mocks.res.send.mock.calls[0][0].permissionType).toBe('administrator');
  });

  test('It should return unauthorized user-website.', async () => {
    const microservice = require('./index');
    const firebaseUser = {
      token: '1qaz2wsx3edc4rfv',
      uid: '0okm9ijn8uhb',
    };
    const user = {
      userId: '0okm9ijn8uhb',
      websiteId: 111,
    };
    const mockResultArray = [
      { // getPermission
        exists: false,
        data: () => ({}),
      }
    ]
    require('firebase-admin').__setMockUser(firebaseUser);
    require('@google-cloud/firestore').__setMockResultArray(mockResultArray);
    let mocks = getMocks();
    mocks.req.headers.authorization = `Beare ${firebaseUser.token}`;
    mocks.req.method = 'POST';
    mocks.req.body = user;
    await microservice.getAuthorization(mocks.req, mocks.res);
    expect(mocks.res.status.mock.calls[0][0]).toBe(401);
    expect(mocks.res.end.mock.calls.length).toBe(1);
  });

});