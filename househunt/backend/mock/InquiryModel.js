const { getStore, saveStore } = require('./mockStore');

const InquiryModel = {
  create: async function(data) {
    const store = getStore();
    
    const newInquiry = {
      _id: 'inquiry_' + Date.now(),
      property: data.property,
      sender: data.sender,
      landlord: data.landlord,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      message: data.message,
      createdAt: new Date().toISOString()
    };

    store.inquiries.push(newInquiry);
    saveStore(store);
    return newInquiry;
  },

  find: function(query = {}) {
    const store = getStore();
    let results = [...store.inquiries];

    // Filter by sender
    if (query.sender) {
      const targetId = query.sender._id || query.sender;
      results = results.filter(i => i.sender === targetId || i.sender?.toString() === targetId?.toString());
    }

    // Filter by landlord
    if (query.landlord) {
      const targetId = query.landlord._id || query.landlord;
      results = results.filter(i => i.landlord === targetId || i.landlord?.toString() === targetId?.toString());
    }

    const populateChain = (dataList) => {
      return dataList.map(inq => {
        const prop = store.properties.find(p => p._id === inq.property || p._id?.toString() === inq.property?.toString());
        const senderUser = store.users.find(u => u._id === inq.sender || u._id?.toString() === inq.sender?.toString());
        const landlordUser = store.users.find(u => u._id === inq.landlord || u._id?.toString() === inq.landlord?.toString());
        
        return {
          ...inq,
          property: prop ? { _id: prop._id, title: prop.title, price: prop.price, location: prop.location } : inq.property,
          sender: senderUser ? { _id: senderUser._id, username: senderUser.username, email: senderUser.email } : inq.sender,
          landlord: landlordUser ? { _id: landlordUser._id, username: landlordUser.username, email: landlordUser.email } : inq.landlord
        };
      });
    };

    const sortChain = (dataList) => {
      return [...dataList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // Return the query object chain
    const chain = {
      populate: (field) => {
        return {
          populate: (field2) => {
            return {
              sort: (sortObj) => {
                const populated = populateChain(results);
                const sorted = sortChain(populated);
                return {
                  then: (cb) => cb(sorted)
                };
              },
              then: (cb) => cb(populateChain(results))
            };
          },
          sort: (sortObj) => {
            const populated = populateChain(results);
            const sorted = sortChain(populated);
            return {
              then: (cb) => cb(sorted)
            };
          },
          then: (cb) => cb(populateChain(results))
        };
      },
      sort: (sortObj) => {
        return {
          then: (cb) => cb(sortChain(results))
        };
      },
      then: (cb) => cb(results)
    };

    return chain;
  }
};

module.exports = InquiryModel;
