const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed Data
const initialProperties = [
  {
    _id: 'prop1',
    title: 'Modern Luxury Penthouse',
    description: 'Stunning penthouse with panoramic skyline views, top-of-the-line stainless steel appliances, floor-to-ceiling windows, and private terrace access. Located in the heart of downtown with 24/7 security and concierge services.',
    price: 3500,
    location: { city: 'Mumbai', address: '45 Skyview Heights, Bandra West', zip: '400050' },
    bedrooms: 3,
    bathrooms: 3,
    type: 'Apartment',
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Swimming Pool', 'Parking', '24/7 Security', 'Elevator', 'Terrace'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop2',
    title: 'Serene Coastal Villa',
    description: 'Escape the hustle and bustle in this gorgeous Mediterranean-style villa. Offers direct beach access, a private infinity pool, a lush tropical garden, and a fully equipped chef kitchen. Ideal for peaceful resort-style living.',
    price: 6200,
    location: { city: 'Goa', address: '12 Ocean Breeze Lane, Calangute', zip: '403516' },
    bedrooms: 4,
    bathrooms: 4.5,
    type: 'Villa',
    amenities: ['Wifi', 'Air Conditioning', 'Swimming Pool', 'Garden', 'Beach Access', 'Parking', 'Kitchen', 'Pet Friendly'],
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop3',
    title: 'Charming Suburb Family House',
    description: 'Perfect family home situated in a quiet, green residential neighborhood. Features a spacious backyard for children and pets, a two-car garage, solar panels, and proximity to top-rated schools and supermarkets.',
    price: 2400,
    location: { city: 'Bangalore', address: '78 Green Leaf Blvd, Indiranagar', zip: '560038' },
    bedrooms: 3,
    bathrooms: 2,
    type: 'House',
    amenities: ['Wifi', 'Air Conditioning', 'Garden', 'Parking', 'Garage', 'Pet Friendly', 'Laundry Room'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop4',
    title: 'Sleek Minimalist Condo',
    description: 'Minimalist industrial condo perfect for working professionals. Offers smart home controls, keyless entry, high-speed fiber internet, and is steps away from public transport and co-working hubs.',
    price: 1800,
    location: { city: 'Delhi', address: '202 Urban Core Hub, Connaught Place', zip: '110001' },
    bedrooms: 1,
    bathrooms: 1,
    type: 'Condo',
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Parking', 'Keyless Entry', 'Smart Home', 'Laundry Room'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop5',
    title: 'Heritage Palace Villa',
    description: 'Experience absolute royalty in this historical heritage palace villa. Boasts hand-painted frescoes, a grand internal courtyard, private jacuzzi, and traditional ethnic architecture combined with modern high-end amenities.',
    price: 5200,
    location: { city: 'Jaipur', address: '12 Palace View Road, Pink City', zip: '302001' },
    bedrooms: 4,
    bathrooms: 4,
    type: 'Villa',
    amenities: ['Wifi', 'Air Conditioning', 'Swimming Pool', 'Garden', '24/7 Security', 'Terrace', 'Kitchen', 'Elevator'],
    images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop6',
    title: 'Cozy Mountain Wood Cabin',
    description: 'Rustic log cabin nestled among pine trees. Ideal for winter getaways. Features a stone fireplace, wood-burning stove, large deck for stargazing, and scenic panoramic views of snow-capped mountains.',
    price: 1200,
    location: { city: 'Manali', address: 'Pine Slope Cabin, Solang Valley', zip: '175131' },
    bedrooms: 2,
    bathrooms: 1.5,
    type: 'House',
    amenities: ['Wifi', 'Garden', 'Parking', 'Fireplace', 'Kitchen', 'Pet Friendly'],
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop7',
    title: 'Modernist Suburban Mansion',
    description: 'Sleek geometric architectural marvel located in a upscale suburb. Massive floorplan includes a double height ceiling foyer, private home theatre, automation systems, smart security, and a beautiful rear deck.',
    price: 3200,
    location: { city: 'Bangalore', address: '45 Villa Greens, Whitefield', zip: '560066' },
    bedrooms: 4,
    bathrooms: 3.5,
    type: 'Villa',
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Swimming Pool', 'Garden', 'Parking', 'Garage', '24/7 Security'],
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'prop8',
    title: 'High-rise Luxury Sky Suite',
    description: 'Stunning premium sky suite located on the 45th floor. Fully furnished by designer brands. Offers a private high-speed elevator, full panoramic glass walls overlooking the sea, and access to the sky lobby lounge.',
    price: 2900,
    location: { city: 'Mumbai', address: 'Suite 4501, Marina Heights, Worli', zip: '400018' },
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    amenities: ['Wifi', 'Air Conditioning', 'Gym', 'Swimming Pool', 'Parking', '24/7 Security', 'Elevator', 'Furnished'],
    images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'],
    status: 'Available',
    landlord: 'landlord1',
    createdAt: new Date().toISOString()
  }
];

const initialUsers = [
  {
    _id: 'landlord1',
    username: 'John Landlord',
    email: 'landlord@househunt.com',
    passwordHash: '$2a$10$Wd90Z6r4x0R9mHj/K56l6e9y7z/GvRkR.87y6w8kKz81234567890', // password123 (hashed)
    role: 'landlord',
    savedProperties: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: 'renter1',
    username: 'Sarah Renter',
    email: 'sarah@househunt.com',
    passwordHash: '$2a$10$Wd90Z6r4x0R9mHj/K56l6e9y7z/GvRkR.87y6w8kKz81234567890', // password123 (hashed)
    role: 'renter',
    savedProperties: [],
    createdAt: new Date().toISOString()
  }
];

// Helper functions to read/write JSON files
const readData = (filePath, defaultData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return defaultData;
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
};

const getStore = () => {
  const users = readData(USERS_FILE, initialUsers);
  const properties = readData(PROPERTIES_FILE, initialProperties);
  const inquiries = readData(INQUIRIES_FILE, []);
  return { users, properties, inquiries };
};

const saveStore = (store) => {
  writeData(USERS_FILE, store.users);
  writeData(PROPERTIES_FILE, store.properties);
  writeData(INQUIRIES_FILE, store.inquiries);
};

module.exports = { getStore, saveStore };
