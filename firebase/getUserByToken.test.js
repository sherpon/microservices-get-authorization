jest.mock('firebase-admin');
const firebaseUser = {
  token: '1qaz2wsx3edc4rfv5tgb',
  uid: 'zxcvbnmlkjhgfdsa'
};
require('firebase-admin').__setMockUser(firebaseUser);
const firebase = require('firebase-admin');

const getUserbyToken = require('./getUserByToken');

describe('Test getUserbyToken', () => {
  

  beforeEach(() => {
  });

  test('It should get the user.', async () => {
    await expect(getUserbyToken(firebase, firebaseUser.token)).resolves.toEqual(firebaseUser.uid);
  });

  test('It shouldn\'t get the user.', async () => {
    await expect(getUserbyToken(firebase, 'asdfgsg')).rejects.toThrow('error: the token doesn\'t exist.');
  });

  test('It should return an error because there isn\'t a valid token.', async () => {
    await expect(getUserbyToken(firebase)).rejects.toThrow('error: token is undefined');
  });

  test('It should return an error because there isn\'t a empty token.', async () => {
    await expect(getUserbyToken(firebase, '')).rejects.toThrow('error: token is empty');
  });

});