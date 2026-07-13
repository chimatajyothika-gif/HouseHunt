const { getStore, saveStore } = require('./mockStore');

const PropertyModel = {
  find: function(query = {}) {
    const store = getStore();
    let results = [...store.properties];

    // Filter by city
    if (query['location.city']) {
      const cityVal = query['location.city'].$regex;
      const regex = new RegExp(cityVal, 'i');
      results = results.filter(p => p.location && regex.test(p.location.city));
    }

    // Filter by type
    if (query.type) {
      results = results.filter(p => p.type === query.type);
    }

    // Filter by price
    if (query.price) {
      if (query.price.$gte !== undefined) {
        results = results.filter(p => p.price >= query.price.$gte);
      }
      if (query.price.$lte !== undefined) {
        results = results.filter(p => p.price <= query.price.$lte);
      }
    }

    // Filter by bedrooms
    if (query.bedrooms !== undefined) {
      results = results.filter(p => p.bedrooms === query.bedrooms);
    }

    // Filter by bathrooms
    if (query.bathrooms !== undefined) {
      results = results.filter(p => p.bathrooms === query.bathrooms);
    }

    // Filter by landlord ID
    if (query.landlord) {
      const targetId = query.landlord._id || query.landlord;
      results = results.filter(p => p.landlord === targetId || p.landlord?.toString() === targetId?.toString());
    }

    // Search query keyword matcher
    if (query.$or) {
      results = results.filter(p => {
        return query.$or.some(q => {
          const field = Object.keys(q)[0];
          const val = q[field].$regex;
          const regex = new RegExp(val, 'i');
          
          if (field.startsWith('location.')) {
            const subField = field.split('.')[1];
            return p.location && regex.test(p.location[subField]);
          }
          return regex.test(p[field]);
        });
      });
    }

    // Helper to populate landlord details
    const populateLandlord = (dataList) => {
      return dataList.map(p => {
        const landlordUser = store.users.find(u => u._id === p.landlord || u._id?.toString() === p.landlord?.toString());
        return {
          ...p,
          landlord: landlordUser ? { _id: landlordUser._id, username: landlordUser.username, email: landlordUser.email } : p.landlord
        };
      });
    };

    const chain = {
      populate: (field) => {
        const populated = populateLandlord(results);
        return {
          then: (cb) => cb(populated)
        };
      },
      then: (cb) => cb(populateLandlord(results))
    };

    return chain;
  },

  findById: function(id) {
    const store = getStore();
    const propertyObj = store.properties.find(p => p._id === id || p._id?.toString() === id?.toString());

    if (!propertyObj) {
      return {
        populate: () => ({ then: (cb) => cb(null) }),
        then: (cb) => cb(null)
      };
    }

    const populateLandlord = () => {
      const landlordUser = store.users.find(u => u._id === propertyObj.landlord || u._id?.toString() === propertyObj.landlord?.toString());
      return {
        ...propertyObj,
        landlord: landlordUser ? { _id: landlordUser._id, username: landlordUser.username, email: landlordUser.email } : propertyObj.landlord
      };
    };

    const chain = {
      populate: (field) => {
        return {
          then: (cb) => cb(populateLandlord())
        };
      },
      then: (cb) => cb(populateLandlord()),
      ...propertyObj
    };
    return chain;
  },

  create: async function(data) {
    const store = getStore();
    
    // Resolve location
    let locationData = data.location;
    if (!locationData) {
      locationData = {
        city: data.city,
        address: data.address,
        zip: data.zip
      };
    }

    const newProperty = {
      _id: 'prop_' + Date.now(),
      title: data.title,
      description: data.description,
      price: Number(data.price),
      location: locationData,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      type: data.type,
      amenities: data.amenities || [],
      images: data.images || [],
      status: 'Available',
      landlord: data.landlord?.toString() || data.landlord,
      createdAt: new Date().toISOString()
    };

    store.properties.push(newProperty);
    saveStore(store);
    return newProperty;
  },

  findByIdAndUpdate: async function(id, data, options) {
    const store = getStore();
    const index = store.properties.findIndex(p => p._id === id || p._id?.toString() === id?.toString());

    if (index === -1) return null;

    const existing = store.properties[index];
    
    // Handle location update merging
    let locationData = existing.location;
    if (data.location) {
      locationData = data.location;
    } else if (data.city || data.address || data.zip) {
      locationData = {
        city: data.city || existing.location?.city,
        address: data.address || existing.location?.address,
        zip: data.zip || existing.location?.zip
      };
    }

    const updated = {
      ...existing,
      ...data,
      location: locationData
    };

    // Clean numeric properties
    if (updated.price) updated.price = Number(updated.price);
    if (updated.bedrooms) updated.bedrooms = Number(updated.bedrooms);
    if (updated.bathrooms) updated.bathrooms = Number(updated.bathrooms);

    store.properties[index] = updated;
    saveStore(store);
    return updated;
  },

  findByIdAndDelete: async function(id) {
    const store = getStore();
    const initialLength = store.properties.length;
    store.properties = store.properties.filter(p => p._id !== id && p._id?.toString() !== id?.toString());
    saveStore(store);
    return store.properties.length < initialLength;
  }
};

module.exports = PropertyModel;
