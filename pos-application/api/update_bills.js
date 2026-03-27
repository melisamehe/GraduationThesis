const { MongoClient } = require('mongodb');

async function run() {
  const uri = 'mongodb+srv://melisamehenktas1:12melisa12@cluster0.2zalut4.mongodb.net/pos-application';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('pos-application');
    
    const bills = await db.collection('bills').find().toArray();
    console.log(`Found ${bills.length} bills.`);
    
    for (let i = 0; i < bills.length; i++) {
      const newDate = new Date();
      // Spread them across the last 15 days
      newDate.setDate(newDate.getDate() - i * 1.5); 
      
      await db.collection('bills').updateOne(
        { _id: bills[i]._id },
        { $set: { createdAt: newDate } }
      );
    }
    
    console.log(`Successfully updated dates for ${bills.length} bills to be within the last 30 days.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
