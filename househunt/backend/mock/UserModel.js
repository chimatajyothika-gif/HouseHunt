const bcrypt = require('bcryptjs');
const { getStore, saveStore } = require('./mockStore');

class MockUserInstance {
  constructor(data) {
    Object.assign(this, data);
  }

  async save() {
    const store = getStore();
    const index = store.users.findIndex(u => u._id === this._id);
    
    // Hash password if modified / raw password set
    if (this.password && !this.passwordHash) {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.password, salt);
      delete this.password;
    }

    const savedData = { ...this };
    
    // Remove functions from saved json data
    const cleanData = JSON.parse(JSON.stringify(savedData));

    if (index > -1) {
      store.users[index] = cleanData;
    } else {
      store.users.push(cleanData);
    }
    saveStore(store);
    return this;
  }

  async matchPassword(enteredPassword) {
    if (this.passwordHash) {
      // In the seed script, we set passwordHash directly. If it is already a bcrypt hash:
      if (this.passwordHash.startsWith('$2')) {
        return await bcrypt.compare(enteredPassword, this.passwordHash);
      }
      return enteredPassword === this.passwordHash;
    }
    return false;
  }
}

const UserModel = {
  findOne: function(query) {
    const store = getStore();
    let user;

    if (query.$or) {
      const emailQuery = query.$or.find(q => q.email)?.email;
      const usernameQuery = query.$or.find(q => q.username)?.username;
      user = store.users.find(u => u.email === emailQuery || u.username === usernameQuery);
    } else if (query.email) {
      user = store.users.find(u => u.email === query.email);
    }

    if (!user) {
      const chain = {
        select: () => null,
        then: (cb) => cb(null),
        catch: () => chain
      };
      return chain;
    }

    const instance = new MockUserInstance(user);
    const chain = {
      select: () => instance,
      then: (cb) => cb(instance),
      catch: () => chain,
      ...instance
    };
    return chain;
  },

  findById: function(id) {
    const store = getStore();
    const userObj = store.users.find(u => u._id === id || u._id?.toString() === id?.toString());
    
    if (!userObj) {
      const chain = {
        select: () => null,
        populate: () => null,
        then: (cb) => cb(null)
      };
      return chain;
    }

    const instance = new MockUserInstance(userObj);
    const chain = {
      select: (fields) => {
        // Simulate select('-password') by removing passwordHash from the returned copy
        if (fields && fields.includes('-password')) {
          const copy = new MockUserInstance({ ...userObj });
          delete copy.password;
          delete copy.passwordHash;
          return copy;
        }
        return instance;
      },
      populate: (field) => {
        if (field === 'savedProperties') {
          instance.savedProperties = (instance.savedProperties || []).map(propId => {
            const p = store.properties.find(pr => pr._id === propId || pr._id?.toString() === propId?.toString());
            return p || propId;
          });
        }
        return instance;
      },
      then: (cb) => cb(instance),
      ...instance
    };
    return chain;
  },

  create: async function(data) {
    const store = getStore();
    
    const newUser = {
      _id: 'user_' + Date.now(),
      username: data.username,
      email: data.email,
      role: data.role || 'renter',
      savedProperties: [],
      createdAt: new Date().toISOString()
    };

    const salt = await bcrypt.genSalt(10);
    newUser.passwordHash = await bcrypt.hash(data.password, salt);

    store.users.push(newUser);
    saveStore(store);

    return new MockUserInstance(newUser);
  }
};

module.exports = UserModel;
