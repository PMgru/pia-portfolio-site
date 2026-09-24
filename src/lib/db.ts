import { MongoClient } from 'mongodb';

// Default initial data for seeding
const getInitialData = () => {
  return {
    users: [
      {
        id: 'admin-1',
        email: 'pial@pialmahmud.com',
        // bcrypt hash for password: "admin123" (demo credential, change in production)
        password_hash: '$2a$10$krRmDr4/j8kzX5vqmPk7cO.vYaPJ8jlEeIShS8DfRkI6kh39LiWYO',
        name: 'Pial Mahmud',
        role: 'admin',
        created_at: new Date().toISOString()
      }
    ],
    pages: [],
    projects: [],
    experiences: [],
    skills: [],
    testimonials: [],
    blog_posts: [],
    services: [],
    chatbot_knowledge: [],
    analytics_events: [],
    site_settings: [
      { id: 'set-1', key: 'logo_text', value: 'PM' },
      { id: 'set-2', key: 'hero_title', value: 'Engineering Digital Growth Beyond the Algorithm.' },
      { id: 'set-3', key: 'hero_subtitle', value: 'AI Specialist | Data-Driven Digital Marketer | SEO Growth Hacker' },
      { id: 'set-4', key: 'email', value: 'hello@pialmahmud.com' }
    ],
    contact_messages: [],
    newsletter_subs: [],
    home_content: [],
    work_items: []
  };
};

const MONGODB_URI = process.env.MONGODB_URI;

let client: MongoClient | null = null;
let dbPromise: Promise<any> | null = null;

async function getDb() {
  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Data will not be saved properly in serverless environments.");
    return null;
  }
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    dbPromise = client.connect().then(c => c.db('portfolio'));
  }
  return dbPromise;
}

// In-memory fallback if no MONGODB_URI is provided
let memoryCache: any = null;
async function getMemoryCache() {
  if (memoryCache) return memoryCache;
  memoryCache = getInitialData();
  return memoryCache;
}

export class JsonDb {
  public static async getCollection(name: string): Promise<any[]> {
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      return cache[name] || [];
    }
    const collection = db.collection(name);
    return collection.find({}).toArray();
  }

  public static async saveCollection(name: string, items: any[]): Promise<void> {
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      cache[name] = items;
      return;
    }
    const collection = db.collection(name);
    // Extremely simplified: delete all and insert many for small collections
    if (items.length > 0) {
      await collection.deleteMany({});
      await collection.insertMany(items);
    } else {
      await collection.deleteMany({});
    }
  }

  public static async insert(name: string, item: any): Promise<any> {
    const newItem = {
      id: `${name.substring(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: new Date().toISOString(),
      ...item
    };
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      cache[name] = cache[name] || [];
      cache[name].push(newItem);
      return newItem;
    }
    await db.collection(name).insertOne(newItem);
    return newItem;
  }

  public static async update(name: string, id: string, updates: any): Promise<boolean> {
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      const items = cache[name] || [];
      const index = items.findIndex((x: any) => x.id === id || x.key === id);
      if (index === -1) return false;
      items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
      return true;
    }
    
    // Convert key -> id if applicable
    const query = { $or: [{ id: id }, { key: id }] };
    const result = await db.collection(name).updateOne(query, {
      $set: { ...updates, updated_at: new Date().toISOString() }
    });
    return result.modifiedCount > 0;
  }

  public static async delete(name: string, id: string): Promise<boolean> {
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      const items = cache[name] || [];
      const filtered = items.filter((x: any) => x.id !== id && x.key !== id);
      if (items.length === filtered.length) return false;
      cache[name] = filtered;
      return true;
    }
    
    const query = { $or: [{ id: id }, { key: id }] };
    const result = await db.collection(name).deleteOne(query);
    return result.deletedCount > 0;
  }

  public static async getAllSettings(): Promise<Record<string, any>> {
    const items = await this.getCollection('site_settings');
    const map: Record<string, any> = {};
    for (const s of items) map[s.key] = s.value;
    return map;
  }

  public static async getSetting(key: string, fallback: any = null): Promise<any> {
    const items = await this.getCollection('site_settings');
    const found = items.find(s => s.key === key);
    return found ? found.value : fallback;
  }

  public static async setSetting(key: string, value: any): Promise<void> {
    const db = await getDb();
    if (!db) {
      const cache = await getMemoryCache();
      cache['site_settings'] = cache['site_settings'] || [];
      const index = cache['site_settings'].findIndex((s: any) => s.key === key);
      if (index === -1) {
         cache['site_settings'].push({ id: `set-${Date.now()}`, key, value, updated_at: new Date().toISOString() });
      } else {
         cache['site_settings'][index] = { ...cache['site_settings'][index], value, updated_at: new Date().toISOString() };
      }
      return;
    }

    const collection = db.collection('site_settings');
    const existing = await collection.findOne({ key });
    if (existing) {
      await collection.updateOne({ key }, { $set: { value, updated_at: new Date().toISOString() } });
    } else {
      await collection.insertOne({ id: `set-${Date.now()}`, key, value, updated_at: new Date().toISOString() });
    }
  }
}
