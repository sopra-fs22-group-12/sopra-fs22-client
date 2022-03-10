/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.loggedIn = null;
    this.date = null;
    this.birthday = null;
    Object.assign(this, data);
  }
}
export default User;
